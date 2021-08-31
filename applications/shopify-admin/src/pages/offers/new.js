import { memo } from 'react';
import { useRouter } from 'next/router';
import { Loading } from '@shopify/app-bridge-react';
import {
  Page,
  Layout,
  Card,
  TextContainer,
  Banner,
  SkeletonPage,
  SkeletonDisplayText,
  SkeletonBodyText
} from '@shopify/polaris';
import { omit } from 'lodash';
import { Loader } from '@neatowebsolutions/upselling-react-components';
import { useShop, useOffer, usePopupTheme, usePopupThemes } from '../../hooks';
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
  enableVariantSelection: true,
  enableQuantitySelection: true,
  disableOutOfStockVariants: true,
  enableEscClose: false,
  enableMaskClose: false,
  animation: 'effect-slide-in-scale',
  enabled: true
};

const NewOfferPage = () => {
  const router = useRouter();
  const { shop, shopLoading, shopError } = useShop();
  const { saveOffer } = useOffer();
  const { savePopupTheme } = usePopupTheme();
  const {
    popupThemes,
    popupThemesLoading,
    popupThemesError
  } = usePopupThemes();

  // Use a copy of the first theme as the default theme. Remove _id to ensure
  // the copy will have its own ID when saved.
  // const offerPopupTheme = omit(popupThemes?.[0], '_id');
  const offerPopupTheme = omit(
    popupThemes?.find(
      ({ strategies }) => strategies.indexOf(initialOffer.strategy) > -1
    ),
    ['_id', '__v', 'updatedAt', 'createdAt']
  );

  const loading = shopLoading || popupThemesLoading;
  const error = !!(shopError || popupThemesError);

  const handleSubmit = async (data) => {
    // Save the offer.
    const updatedOffer = await saveOffer(data.offer);

    // Associate the offer popup themes with the offer.
    data.popupTheme.offer = updatedOffer._id;
    data.offerPopupThemes = data.offerPopupThemes.map((current) => ({
      ...current,
      offer: updatedOffer._id
    }));

    // Save the selected popup theme and the other popup themes in parallel.
    const [updatedPopupTheme] = await Promise.all(
      data.offerPopupThemes.map(async (current) => {
        return await savePopupTheme(current);
      })
    );

    // Associate the selected popup theme with the offer.
    updatedOffer.popupTheme = updatedPopupTheme._id;

    // Update the offer.
    await saveOffer(updatedOffer);

    // Redirect to the offer edit page.
    router.push(`/offers/${updatedOffer._id}/`);
  };

  const handleCancel = () => {
    router.push('/offers/');
  };

  return (
    <Loader
      isLoading={loading}
      isError={error}
      loadingComponent={loadingComponent}
      errorComponent={errorComponent}
    >
      <Page title="Create offer">
        <PageTitleBar />
        {!loading && !error && (
          <OfferForm
            initialValues={{
              offer: initialOffer,
              popupTheme: offerPopupTheme,
              offerPopupThemes: [offerPopupTheme]
            }}
            shop={shop}
            popupThemes={popupThemes}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </Page>
    </Loader>
  );
};

export default NewOfferPage;
