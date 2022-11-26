import { memo, useState } from 'react';
import { useRouter } from 'next/router';
import { Loading } from '@shopify/app-bridge-react';
import {
  Page,
  Layout,
  Card,
  TextContainer,
  Breadcrumbs,
  Banner,
  Stack,
  Modal,
  SkeletonPage,
  SkeletonDisplayText,
  SkeletonBodyText
} from '@shopify/polaris';
import { omit } from 'lodash';
import { Loader } from '@greatupsells/react-components';
import { useShop, useOffer, useTheme, useThemes, useToast } from '../../hooks';
import { TitleBar, OfferForm } from '../../components';

const PageTitleBar = memo(() => (
  <TitleBar
    title="Create offer"
    primaryAction={null}
    breadcrumbs={[{ content: 'Offers', url: '/offers/' }]}
  />
));

const loadingComponent = () => (
  <>
    <Loading />
    <SkeletonPage secondaryActions={3}>
      <PageTitleBar />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={2} />
            </TextContainer>
          </Card>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={3} />
            </TextContainer>
          </Card>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card subdued>
            <Card.Section>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={2} />
              </TextContainer>
            </Card.Section>
            <Card.Section>
              <SkeletonBodyText lines={2} />
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  </>
);

const errorComponent = () => (
  <Page fullWidth>
    <PageTitleBar />
    <Banner
      title="Unable to load new offer page"
      status="critical"
      action={{
        content: 'Try again',
        onAction: () => window.location.reload()
      }}
    >
      Unable to load offer. Please try again shortly.
    </Banner>
  </Page>
);

const initialOffer = {
  name: '',
  strategy: 'CROSS_SELL',
  actionButtonBehavior: 'CHECKOUT',
  viewAllowance: 'DAYS',
  viewAllowanceDays: 7,
  offeredProducts: [],
  offeredCollections: [],
  discountType: 'PERCENTAGE',
  discountValue: 0.1,
  discountTitle: 'Discount',
  triggerEvent: 'ADD',
  triggerExternalLinksOnly: true,
  triggerScrollThreshold: 75,
  triggerPage: 'ANY',
  triggerProducts: [],
  triggerCollections: [],
  enableBundling: false,
  minimumRequirement: 'NONE',
  geotargetingCountries: [],
  startAt: new Date().toISOString(),
  performActionOnAdd: true,
  enableVariantSelection: true,
  enableQuantitySelection: true,
  enableEscClose: false,
  enableMaskClose: false,
  animation: 'effect-slide-in-scale',
  enabled: true
};

const NewOfferPage = () => {
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const { shop, shopLoaded, shopError, consentToDataAccess } = useShop();
  const { saveOffer } = useOffer();
  const { saveTheme } = useTheme();
  const { themes, themesLoaded, themesError } = useThemes();
  const [consentingToDataAccess, setConsentingToDataAccess] = useState(false);

  // Use a copy of the first theme as the default theme. Remove _id to ensure
  // the copy will have its own ID when saved.
  // const offerTheme = omit(themes?.[0], '_id');
  const offerTheme = omit(
    themes?.find(
      ({ strategies }) => strategies.indexOf(initialOffer.strategy) > -1
    ),
    ['_id', '__v', 'updatedAt', 'createdAt']
  );

  const loaded = shopLoaded && themesLoaded;
  const error = !!(shopError || themesError);

  const handleSubmit = async (data) => {
    try {
      // Save the offer.
      const updatedOffer = await saveOffer(data.offer);

      // Associate the offer themes with the offer.
      data.theme.offer = updatedOffer._id;
      data.offerThemes = data.offerThemes.map((current) => ({
        ...current,
        offer: updatedOffer._id
      }));

      // Save the selected theme and the other themes in parallel.
      const [updatedTheme] = await Promise.all(
        data.offerThemes.map(async (current) => {
          return await saveTheme(current);
        })
      );

      // Associate the selected theme with the offer.
      updatedOffer.theme = updatedTheme._id;

      // Update the offer.
      await saveOffer(updatedOffer);

      // Redirect to the offer edit page.
      router.push(`/offers/${updatedOffer._id}/`);

      showSuccessToast('Offer created.');
    } catch (saveError) {
      showErrorToast('Error creating offer.');
    }
  };

  const handleCancel = () => {
    router.push('/offers/');
  };

  const handleConsentToDataAccess = async () => {
    setConsentingToDataAccess(true);
    await consentToDataAccess();
  };

  initialOffer.maximumOfferedProductQuantity =
    offerTheme.maximumOfferedProductQuantity || 3;

  return (
    <Loader
      isLoading={!loaded}
      isError={error}
      loadingComponent={loadingComponent}
      errorComponent={errorComponent}
    >
      <Page
        title={
          <Stack alignment="center">
            <Breadcrumbs breadcrumbs={[{ url: '/offers' }]} />
            <span>Create offer</span>
          </Stack>
        }
      >
        <PageTitleBar />
        {loaded && !error && (
          <OfferForm
            initialValues={{
              offer: initialOffer,
              theme: offerTheme,
              offerThemes: [offerTheme]
            }}
            shop={shop}
            themes={themes}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </Page>
      <Modal
        open={shop && !shop.consentedToDataAccessAt}
        title="Data access"
        primaryAction={{
          content: 'I understand',
          onAction: handleConsentToDataAccess,
          loading: consentingToDataAccess
        }}
        onClose={handleConsentToDataAccess}
      >
        <Modal.Section>
          <TextContainer>
            <p>
              Please note that this app does not access, processes, or store
              customer personal data.
            </p>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </Loader>
  );
};

export default NewOfferPage;
