import { useRouter } from 'next/router';
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Banner,
  SkeletonPage,
  SkeletonDisplayText,
  SkeletonBodyText
} from '@shopify/polaris';
import { omit } from 'lodash';
import { Loader } from '@greatupsells/react-components';
import { useShop, useOffer, useTheme, useThemes, useToast } from '../../hooks';
import { OfferForm } from '../../components';

const LoadingComponent = () => (
  <SkeletonPage>
    <Layout>
      <Layout.Section>
        <Card>
          <BlockStack gap="200" padding="400">
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={2} />
          </BlockStack>
        </Card>
        <Card>
          <BlockStack gap="200" padding="400">
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={3} />
          </BlockStack>
        </Card>
        <Card>
          <BlockStack gap="200" padding="400">
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText lines={4} />
          </BlockStack>
        </Card>
      </Layout.Section>
      <Layout.Section>
        <Card>
          <BlockStack>
            <BlockStack gap="200" padding="400">
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={2} />
            </BlockStack>
          </BlockStack>
          <BlockStack>
            <SkeletonBodyText lines={2} />
          </BlockStack>
        </Card>
      </Layout.Section>
    </Layout>
  </SkeletonPage>
);

const ErrorComponent = () => (
  <Page fullWidth>
    <Banner
      title="Unable to load new offer page"
      tone="critical"
      action={{
        content: 'Try again',
        onAction: () => window.location.reload()
      }}
    >
      Unable to load page. Please try again shortly.
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
  performActionOnAdd: false,
  enableVariantSelection: true,
  enableQuantitySelection: true,
  enableEscClose: true,
  enableMaskClose: true,
  animation: 'effect-slide-in-scale',
  enabled: true
};

const NewOfferPage = () => {
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const { shop, shopLoaded, shopError } = useShop();
  const { saveOffer } = useOffer();
  const { saveTheme } = useTheme();
  const { themes, themesLoaded, themesError } = useThemes();

  // Use a copy of the first theme as the default theme. Remove _id to ensure
  // the copy will have its own ID when saved.
  // const offerTheme = omit(themes?.[0], '_id');
  const offerTheme = omit(
    themes?.find(({ strategies }) => strategies.indexOf(initialOffer.strategy) > -1),
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

  initialOffer.maximumOfferedProductQuantity = offerTheme.maximumOfferedProductQuantity || 3;

  return (
    <Loader isLoading={!loaded} isError={error} loadingComponent={LoadingComponent} errorComponent={ErrorComponent}>
      <Page title="Add offer" backAction={{ content: 'Offers', url: `/offers` }}>
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
    </Loader>
  );
};

export default NewOfferPage;
