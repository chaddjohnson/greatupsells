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
import {
  useShop,
  useOffer,
  usePopupTheme,
  usePopupThemes,
  useToast
} from '../../hooks';
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
  actionButtonBehavior: 'CART',
  viewAllowance: 'DAYS',
  viewAllowanceDays: 7,
  offeredProducts: [],
  offeredCollections: [],
  minimumProductsQuantity: 1,
  discountType: 'PERCENTAGE',
  discountAmount: 0.1,
  triggerEvent: 'LOAD',
  triggerExternalLinksOnly: true,
  triggerScrollThreshold: 75,
  triggerPage: 'ANY',
  triggerProducts: [],
  triggerCollections: [],
  enableGeotargeting: true,
  geotargetingCountries: [],
  startAt: new Date().toISOString(),
  delaySeconds: 0,
  onPageRequiredSeconds: 0,
  allowWithDiscountCodes: true,
  hideIfItemAdded: false,
  enableVariantSelection: true,
  enableQuantitySelection: true,
  limitQuantitySelection: false,
  hideOutOfStockProducts: true,
  enableEscClose: false,
  enableMaskClose: false,
  // discountCodes
  // discountPricingMethod
  enabled: true
};

const NewOfferPage = () => {
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
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
    popupThemes?.find(({ strategy }) => strategy === initialOffer.strategy),
    ['_id', '__v', 'updatedAt', 'createdAt']
  );

  const loading = shopLoading || popupThemesLoading;
  const error = !!(shopError || popupThemesError);

  const handleSubmit = async ({
    offer: offerData,
    popupTheme: popupThemeData,
    offerPopupThemes: offerPopupThemesData
  }) => {
    try {
      // Save the offer.
      const updatedOfferData = await saveOffer(offerData);

      // Associate the offer popup themes with the offer.
      popupThemeData.offer = updatedOfferData._id;
      offerPopupThemesData = offerPopupThemesData.map((data) => ({
        ...data,
        offer: updatedOfferData._id
      }));

      // Save the selected popup theme and the other popup themes in parallel.
      const [updatedPopupThemeData] = await Promise.all([
        savePopupTheme(popupThemeData),
        ...offerPopupThemesData
          .filter(({ _id }) => _id !== popupThemeData._id)
          .map(savePopupTheme)
      ]);

      // Associate the selected popup theme with the offer.
      updatedOfferData.popupTheme = updatedPopupThemeData._id;

      // Update the offer.
      await saveOffer(offerData);

      showSuccessToast('Offer created.');

      // Redirect to the offer edit page.
      router.push(`/offers/${updatedOfferData._id}/`);
    } catch (submitError) {
      showErrorToast('Error creating offer.');
      throw submitError;
    }
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
