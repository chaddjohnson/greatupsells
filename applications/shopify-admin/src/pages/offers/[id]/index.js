import { memo, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Loading, Modal } from '@shopify/app-bridge-react';
import {
  Page,
  Layout,
  Card,
  TextContainer,
  Breadcrumbs,
  Banner,
  Stack,
  SkeletonPage,
  SkeletonDisplayText,
  SkeletonBodyText
} from '@shopify/polaris';
import {
  DuplicateMinor,
  CircleDisableMinor,
  CircleTickOutlineMinor
} from '@shopify/polaris-icons';
import { Loader } from '@neatowebsolutions/upselling-react-components';
import {
  useShop,
  useOffer,
  usePopupTheme,
  usePopupThemes,
  useOfferPopupThemes,
  useToast
} from '../../../hooks';

import { TitleBar, OfferForm } from '../../../components';

const PageTitleBar = memo(() => (
  <TitleBar
    title="Edit offer"
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
      title="Unable to load offer"
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

const OfferEditPage = () => {
  const router = useRouter();
  const offerId = router.query.id;

  const { showSuccessToast, showErrorToast } = useToast();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { shop, shopLoading, shopError } = useShop();
  const {
    offer,
    offerLoading,
    offerError,
    saveOffer,
    deleteOffer,
    duplicateOffer,
    enableOffer,
    disableOffer
  } = useOffer(offerId);
  const { savePopupTheme } = usePopupTheme();
  const {
    popupThemes,
    popupThemesLoading,
    popupThemesError
  } = usePopupThemes();
  const {
    offerPopupThemes,
    offerPopupThemesLoading,
    offerPopupThemesError
  } = useOfferPopupThemes(offerId);

  // Get a reference to the offer's popup theme.
  const offerPopupTheme = useMemo(
    () => offerPopupThemes?.find(({ _id }) => _id === offer?.popupTheme),
    [offerPopupThemes, offer]
  );

  const loading =
    shopLoading ||
    offerLoading ||
    popupThemesLoading ||
    offerPopupThemesLoading;

  const error = !!(
    shopError ||
    offerError ||
    popupThemesError ||
    offerPopupThemesError
  );

  const handleSubmit = async (data) => {
    try {
      // Save the offer.
      const updatedOffer = await saveOffer(data.offer);

      // Associate the offer popup themes with the offer.
      data.popupTheme.offer = updatedOffer._id;
      data.offerPopupThemes = data.offerPopupThemes.map((current) => ({
        ...current,
        offer: updatedOffer._id
      }));

      // Save the selected popup theme and the other popup themes in parallel.
      const [updatedPopupTheme] = await Promise.all([
        savePopupTheme(data.popupTheme),
        ...data.offerPopupThemes
          .filter(({ _id }) => _id !== data.popupTheme._id)
          .map(async (current) => {
            return await savePopupTheme(current);
          })
      ]);

      if (
        updatedPopupTheme?._id &&
        updatedOffer.popupTheme !== updatedPopupTheme._id
      ) {
        // Associate the selected popup theme with the offer.
        updatedOffer.popupTheme = updatedPopupTheme._id;

        // Update the offer.
        await saveOffer(updatedOffer);
      }

      showSuccessToast('Offer updated.');
    } catch (saveError) {
      showErrorToast(`Error updating offer.`);
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

  // const handleTest = () => {
  //   // TODO
  // };

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
    // {
    //   content: 'Test',
    //   accessibilityLabel: 'Test this offer',
    //   icon: ExternalMinor,
    //   onAction: handleTest
    // },
    {
      content: 'Duplicate',
      accessibilityLabel: 'Duplicate this offer',
      icon: DuplicateMinor,
      onAction: handleDuplicate
    },
    {
      content: offer?.enabled ? 'Disable' : 'Enable',
      accessibilityLabel: offer?.enabled
        ? 'Disable this offer'
        : 'Enable this offer',
      icon: offer?.enabled ? CircleDisableMinor : CircleTickOutlineMinor,
      onAction: handleToggleEnabled
    }
  ];

  return (
    <>
      <Loader
        isLoading={loading}
        isError={error}
        loadingComponent={loadingComponent}
        errorComponent={errorComponent}
      >
        <Page
          title={
            <Stack alignment="center">
              <Breadcrumbs breadcrumbs={[{ url: '/offers' }]} />
              <span>{offer?.name}</span>
            </Stack>
          }
          secondaryActions={secondaryActions}
        >
          <PageTitleBar />
          {!loading && !error && (
            <OfferForm
              initialValues={{
                offer,
                popupTheme: offerPopupTheme,
                offerPopupThemes
              }}
              shop={shop}
              popupThemes={popupThemes}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              onDelete={handleDelete}
            />
          )}
        </Page>
      </Loader>
      <Modal
        title={`Delete ${offer?.name}`}
        message={`Are you sure you want to delete the offer ${offer?.name}? This can’t be undone.`}
        open={deleteModalOpen}
        primaryAction={{
          content: 'Delete offer',
          destructive: true,
          onAction: handleConfirmDelete
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: handleCancelDelete
          }
        ]}
      />
    </>
  );
};

export default OfferEditPage;
