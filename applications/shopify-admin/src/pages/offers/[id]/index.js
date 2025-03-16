import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import qs from 'querystringify';
import { Modal, TitleBar } from '@shopify/app-bridge-react';
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Banner,
  Box,
  Text,
  SkeletonPage,
  SkeletonDisplayText,
  SkeletonBodyText
} from '@shopify/polaris';
import {
  ChartVerticalFilledIcon,
  ExternalSmallIcon,
  DuplicateIcon,
  DisabledIcon,
  StatusActiveIcon
} from '@shopify/polaris-icons';
import { Loader } from '@greatupsells/react-components';
import { useShop, useOffer, useTheme, useThemes, useOfferThemes, useCollection, useProduct, useToast } from '../../../hooks';

import { OfferForm } from '../../../components';

const LoadingComponent = () => (
  <SkeletonPage>
    <Layout>
      <Layout.Section>
        <BlockStack gap="400">
          <Card>
            <BlockStack gap="200" padding="400">
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={2} />
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="200" padding="400">
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={15} />
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="200" padding="400">
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={15} />
            </BlockStack>
          </Card>
        </BlockStack>
      </Layout.Section>
      <Layout.Section variant="oneThird">
        <BlockStack gap="400">
          <Card>
            <BlockStack gap="200" padding="400">
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={16} />
            </BlockStack>
          </Card>
          <Card>
            <SkeletonBodyText lines={10} />
          </Card>
        </BlockStack>
      </Layout.Section>
    </Layout>
  </SkeletonPage>
);

const ErrorComponent = () => (
  <Page fullWidth>
    <Banner
      title="Unable to load offer"
      tone="critical"
      action={{
        content: 'Try again',
        onAction: () => window.location.reload()
      }}
    >
      Unable to load offer. Please try again shortly.
    </Banner>
  </Page>
);

const OfferEditPage = () => {
  const router = useRouter();
  const offerId = router.query.id;

  const { showSuccessToast, showErrorToast } = useToast();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { shop, shopLoaded, shopError } = useShop();
  const { offer, offerLoaded, offerError, saveOffer, deleteOffer, duplicateOffer, enableOffer, disableOffer } =
    useOffer(offerId);
  const [latestOffer, setLatestOffer] = useState(null);
  const { saveTheme } = useTheme();
  const { themes, themesLoaded, themesError } = useThemes();
  const { offerThemes, offerThemesLoaded, offerThemesError } = useOfferThemes(offerId);
  const { fetchRandomCollection } = useCollection();
  const { fetchRandomProduct } = useProduct();

  const isTestable =
    ['CROSS_SELL', 'UPSELL'].includes(latestOffer?.strategy) &&
    !['*/orders/*', '*/checkouts/*/thank_you'].includes(latestOffer?.triggerPagePath);

  // Get a reference to the offer's theme.
  const offerTheme = useMemo(() => offerThemes?.find(({ _id }) => _id === offer?.theme), [offerThemes, offer]);

  const loaded = shopLoaded && offerLoaded && themesLoaded && offerThemesLoaded;
  const error = !!(shopError || offerError || themesError || offerThemesError);

  const getTestUrl = async () => {
    let pageUrl = '';
    const { testToken } = shop;
    const shopDomain = sessionStorage.shop || new URLSearchParams(window.location.search).get('shop');
    const triggerProductIndex = Math.floor(Math.random() * latestOffer.triggerProducts.length);
    const triggerCollectionIndex = Math.floor(Math.random() * latestOffer.triggerCollections.length);
    const triggerProduct = latestOffer.triggerProducts[triggerProductIndex];
    const triggerCollection = latestOffer.triggerCollections[triggerCollectionIndex];
    const pageParams = {
      testToken,
      testOfferId: offerId,
      testVariantId: latestOffer.triggerEvent !== 'ADD' ? triggerProduct?.shopifyVariantIds[0] : undefined
    };
    let randomCollection = null;
    let randomProduct = null;

    switch (latestOffer.triggerPagePath) {
      case '/':
        pageUrl = '';
        break;

      case '*/collections/all':
        pageUrl = '/collections/all';
        break;

      case '*/collections/*':
        if (triggerCollection) {
          pageUrl = `/collections/${triggerCollection.handle}`;
        } else {
          randomCollection = await fetchRandomCollection();
          pageUrl = `/collections/${randomCollection.shopifyCollectionData.handle}`;
        }

        break;

      case '*/products/*':
        if (triggerProduct) {
          pageUrl = `/products/${triggerProduct.handle}`;
        } else {
          randomProduct = await fetchRandomProduct();
          pageUrl = `/products/${randomProduct.shopifyProductData.handle}`;
          pageParams.testVariantId =
            latestOffer.triggerEvent !== 'ADD' ? randomProduct.shopifyProductData.variants[0].id : undefined;
        }

        break;

      case '*/blog/*':
        pageUrl = '/blog';
        break;

      case '*/cart':
        pageUrl = '/cart';
        break;

      default:
        break;
    }

    const pageParamsString = qs.stringify(pageParams, true);
    const testUrl = `https://${shopDomain}${pageUrl}/${pageParamsString}`;

    return testUrl;
  };

  const handleOfferUpdate = (updatedOffer) => {
    const changed = JSON.stringify(latestOffer) !== JSON.stringify(updatedOffer);

    if (changed) {
      setLatestOffer(updatedOffer);
    }
  };

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
      const [updatedTheme] = await Promise.all([
        saveTheme(data.theme),
        ...data.offerThemes
          .filter(({ _id }) => _id !== data.theme._id)
          .map(async (current) => {
            return await saveTheme(current);
          })
      ]);

      if (updatedTheme?._id && updatedOffer.theme !== updatedTheme._id) {
        // Associate the selected theme with the offer.
        updatedOffer.theme = updatedTheme._id;

        // Update the offer.
        await saveOffer(updatedOffer);
      }

      showSuccessToast('Offer updated.');
      window.scrollTo(0, 0);
    } catch (saveError) {
      showErrorToast('Error updating offer.');
    }
  };

  const handleCancel = () => {
    router.push('/offers/');
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    await deleteOffer();
    setDeleteModalOpen(false);
    router.push('/offers/');
  };

  const handleTest = async () => {
    const testUrl = await getTestUrl(latestOffer);

    window.open(testUrl, '_blank');
  };

  const handleDuplicate = async () => {
    await duplicateOffer();
  };

  const handleToggleEnabled = async () => {
    if (offer?.enabled) {
      await disableOffer();
    } else {
      await enableOffer();
    }
  };

  const secondaryActions = [
    {
      content: 'Analytics',
      accessibilityLabel: 'Analytics',
      icon: ChartVerticalFilledIcon,
      url: `/offers/${offer?._id}/analytics/`
    },
    {
      content: 'Test',
      accessibilityLabel: 'Test this offer',
      icon: ExternalSmallIcon,
      disabled: !isTestable,
      onAction: handleTest
    },
    {
      content: 'Duplicate',
      accessibilityLabel: 'Duplicate this offer',
      icon: DuplicateIcon,
      onAction: handleDuplicate
    },
    {
      content: offer?.enabled ? 'Disable' : 'Enable',
      accessibilityLabel: offer?.enabled ? 'Disable this offer' : 'Enable this offer',
      icon: offer?.enabled ? DisabledIcon : StatusActiveIcon,
      onAction: handleToggleEnabled
    }
  ];

  return (
    <>
      <Loader isLoading={!loaded} isError={error} loadingComponent={LoadingComponent} errorComponent={ErrorComponent}>
        <Page title={offer?.name} backAction={{ content: 'Offers', url: `/offers` }} secondaryActions={secondaryActions}>
          {loaded && !error && (
            <OfferForm
              initialValues={{
                offer,
                theme: offerTheme,
                offerThemes
              }}
              shop={shop}
              themes={themes}
              onOfferUpdate={handleOfferUpdate}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              onDelete={handleDelete}
            />
          )}
        </Page>
      </Loader>
      <Modal open={deleteModalOpen} onHide={handleCancelDelete}>
        <Box padding="400">
          <Text as="p">Are you sure you want to delete the offer {offer?.name}? This can&apos;t be undone.</Text>
        </Box>
        <TitleBar title={`Delete offer`}>
          <button variant="primary" tone="critical" onClick={handleConfirmDelete}>
            Delete offer
          </button>
          <button onClick={handleCancelDelete}>Cancel</button>
        </TitleBar>
      </Modal>
    </>
  );
};

export default OfferEditPage;
