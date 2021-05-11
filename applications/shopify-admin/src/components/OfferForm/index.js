import React, { useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Layout,
  Card,
  FormLayout,
  Checkbox,
  PageActions
} from '@shopify/polaris';
import { useForm, asChoiceField, getValues } from '@shopify/react-form';
import { ContextualSaveBar } from '@shopify/app-bridge/actions';
import { Context as AppBridgeContext } from '@shopify/app-bridge-react';
import styled from 'styled-components';
import { omit } from 'lodash';
import useFields from './fields';
import OfferSummary from './OfferSummary';
import ThemeEditor from './ThemeEditor';
import OfferSettingsEditor from './OfferSettingsEditor';
import OfferProductsEditor from './OfferProductsEditor';
import OfferTriggersEditor from './OfferTriggersEditor';
import OfferDatesEditor from './OfferDatesEditor';
import OfferGeotargetingEditor from './OfferGeotargetingEditor';
import OfferOptionsEditor from './OfferOptionsEditor';
import dummyData from './dummyData.json';

const { OfferPopup } =
  (typeof window !== 'undefined' &&
    require('@neatowebsolutions/upselling-react-components')) ||
  {};

let themeCount = 0;

const assignId = (object) => {
  // Avoid redefining the property.
  if (typeof object.__id_offerForm !== 'undefined') {
    return object;
  }

  // Define an internal ID for unsaved popup themes.
  return Object.defineProperty(object, '__id_offerForm', {
    value: ++themeCount,
    enumerable: false
  });
};

const assignIds = (objects) => {
  return objects.map(assignId);
};

const OfferPopupContainer = styled.div`
  min-height: 300px;
`;

const OfferForm = ({
  initialValues: {
    offer: initialOffer,
    popupTheme: initialPopupTheme,
    offerPopupThemes: initialOfferPopupThemes
  },
  shop,
  popupThemes,
  onSubmit,
  onCancel
}) => {
  const { currency } = shop;
  let contextualSaveBar = null;

  const app = useContext(AppBridgeContext);

  const [submitted, setSubmitted] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [previewActive, setPreviewActive] = useState(false);
  const [popupTheme, setPopupTheme] = useState(assignId(initialPopupTheme));
  const [offerPopupThemes, setOfferPopupThemes] = useState(
    assignIds(initialOfferPopupThemes)
  );
  const [themeDisplayType, setThemeDisplayType] = useState(
    window.innerWidth >= 768 ? 'desktop' : 'mobile'
  );

  const {
    name,
    strategy,
    triggerEvent,
    triggerExternalLinksOnly,
    triggerScrollThreshold,
    triggerPagePath,
    discountType,
    offeredProducts,
    offeredCollections,
    triggerProducts,
    triggerCollections,
    enableGeotargeting,
    geotargetingCountries,
    actionButtonBehavior,
    actionButtonLink,
    actionButtonLinkOpenInNewTab,
    viewAllowance,
    viewAllowanceDays,
    showNotificationBanner,
    successMessageText,
    startAt,
    endAt,
    enableProductLinks,
    hideOutOfStockProducts,
    delaySeconds,
    onPageRequiredSeconds,
    enableEscClose,
    enableMaskClose,
    enableQuantitySelection,
    limitQuantitySelection,
    productQuantityLimit,
    hideIfItemAdded,
    allowWithDiscountCodes
  } = useFields(initialOffer, showEndDate);

  const { fields, dirty, submit, submitting /* submitErrors */ } = useForm({
    fields: {
      name,
      strategy,
      triggerEvent,
      triggerExternalLinksOnly,
      triggerScrollThreshold,
      triggerPagePath,
      offeredProducts,
      offeredCollections,
      // minimumProductsQuantity,
      discountType,
      // discountAmount,
      triggerProducts,
      triggerCollections,
      enableGeotargeting,
      geotargetingCountries,
      actionButtonBehavior,
      actionButtonLink,
      actionButtonLinkOpenInNewTab,
      viewAllowance,
      viewAllowanceDays,
      showNotificationBanner,
      successMessageText,
      startAt,
      endAt,
      enableProductLinks,
      hideOutOfStockProducts,
      delaySeconds,
      onPageRequiredSeconds,
      enableEscClose,
      enableMaskClose,
      enableQuantitySelection,
      limitQuantitySelection,
      productQuantityLimit,
      hideIfItemAdded,
      allowWithDiscountCodes
    },
    onSubmit: async (formValues) => {
      // TODO: contextualSaveBar.set({ saveAction: { loading: true } });

      setSubmitted(true);

      try {
        // TODO: Handle update.
        await onSubmit({
          offer: formValues,
          popupTheme,
          offerPopupThemes
        });
      } catch (error) {
        return { status: 'fail', errors: error };
      }

      // TODO: contextualSaveBar.dispatch(ContextualSaveBar.Action.HIDE);

      return { status: 'success' };
    }
  });

  contextualSaveBar = ContextualSaveBar.create(app, {
    saveAction: { disabled: !dirty, loading: false },
    discardAction: {
      disabled: false,
      loading: false,
      discardConfirmationModal: dirty
    }
  });

  const offer = useMemo(
    () => ({
      ...initialOffer,
      ...getValues(fields)
    }),
    [initialOffer, fields]
  );

  const copyTheme = (value) => {
    return assignId({
      ...omit(value, ['_id', '__v', 'updatedAt', 'createdAt']),
      offer: offer._id
    });
  };

  const handleStrategyChange = (value) => {
    const firstStrategyPopupTheme = popupThemes.find(
      (current) => current.strategy === value
    );

    // Determine whether there is a theme already associated with this offer for the selected strategy.
    let firstStrategyOfferPopupTheme = offerPopupThemes.find(
      (current) => current.strategy === value
    );

    strategy.onChange(value);

    // If there is not yet a theme associated with the offer for the selected
    // strategy, then copy the first available theme for that strategy.
    if (!firstStrategyOfferPopupTheme && firstStrategyPopupTheme) {
      firstStrategyOfferPopupTheme = copyTheme(firstStrategyPopupTheme);

      // Copy over changes to the current theme to history.
      setOfferPopupThemes([firstStrategyOfferPopupTheme, ...offerPopupThemes]);
    }

    if (firstStrategyOfferPopupTheme) {
      // Use the copied theme.
      setPopupTheme(firstStrategyOfferPopupTheme);
    }
  };

  const handleThemeChange = (value) => {
    setPopupTheme(value);

    setOfferPopupThemes([
      ...offerPopupThemes.map((current) =>
        current.__id_offerForm === value.__id_offerForm ? value : current
      )
    ]);
  };

  const handleThemeSelect = (value) => {
    const copiedTheme = copyTheme(value);

    // Make a copy of the theme and add it as history for the offer, and then
    // copy over changes to the current theme to history.
    setOfferPopupThemes([copiedTheme, ...offerPopupThemes]);

    // Use the copied theme.
    setPopupTheme(copiedTheme);
  };

  const handleThemeDisplayTypeChange = (value) => {
    setThemeDisplayType(value);
  };

  // Handle Contextual Save Bar behavior.
  useEffect(
    () =>
      contextualSaveBar.subscribe(ContextualSaveBar.Action.DISCARD, () => {
        contextualSaveBar.dispatch(ContextualSaveBar.Action.HIDE);
        onCancel();
      }),
    [contextualSaveBar, onCancel]
  );

  // useEffect(
  //   () =>
  //     contextualSaveBar.subscribe(ContextualSaveBar.Action.SAVE, async () => {
  //       // TODO: Show toast message.
  //     }),
  //   [contextualSaveBar]
  // );

  // useEffect(() => {
  //   contextualSaveBar.dispatch(ContextualSaveBar.Action.SHOW);
  // }, [contextualSaveBar]);

  // Set end date to start date when showing end date.
  useEffect(
    () => {
      endAt.onChange(showEndDate ? startAt.value : undefined);
    },
    [showEndDate] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <Form noValidate onSubmit={submit}>
      <Layout>
        <Layout.Section>
          <OfferSettingsEditor
            name={name}
            strategy={strategy}
            triggerEvent={triggerEvent}
            triggerExternalLinksOnly={triggerExternalLinksOnly}
            triggerScrollThreshold={triggerScrollThreshold}
            triggerPagePath={triggerPagePath}
            discountType={discountType}
            actionButtonBehavior={actionButtonBehavior}
            actionButtonLink={actionButtonLink}
            actionButtonLinkOpenInNewTab={actionButtonLinkOpenInNewTab}
            viewAllowance={viewAllowance}
            viewAllowanceDays={viewAllowanceDays}
            currency={currency}
            submitted={submitted}
            onStrategyChange={handleStrategyChange}
          />
          {(offer.strategy === 'UPSELL' || offer.strategy === 'CROSS_SELL') && (
            <OfferProductsEditor offer={offer} />
          )}
          <OfferTriggersEditor offer={offer} />
          <ThemeEditor
            strategy={offer.strategy}
            theme={popupTheme}
            themes={popupThemes}
            offerThemes={offerPopupThemes}
            displayType={themeDisplayType}
            previewElement={
              <OfferPopupContainer>
                <OfferPopup
                  open={true}
                  designMode={!previewActive}
                  designModeZoom={0.8}
                  forceDisplayType={
                    !previewActive ? themeDisplayType : undefined
                  }
                  shop={shop}
                  theme={popupTheme}
                  offer={offer}
                  triggerProduct={dummyData.triggerProduct}
                  offeredProducts={dummyData.offeredProducts}
                  onClose={() => setPreviewActive(false)}
                  onClick={() => setPreviewActive(true)}
                />
              </OfferPopupContainer>
            }
            onPreview={() => setPreviewActive(true)}
            onChange={handleThemeChange}
            onThemeSelect={handleThemeSelect}
            onOfferThemeSelect={setPopupTheme}
            onDisplayTypeChange={handleThemeDisplayTypeChange}
          />
          <OfferDatesEditor
            offer={offer}
            startAt={startAt}
            endAt={endAt}
            showEndDate={showEndDate}
            onShowEndDateChange={() => setShowEndDate(!showEndDate)}
          />
          <OfferGeotargetingEditor
            enableGeotargeting={enableGeotargeting}
            geotargetingCountries={geotargetingCountries}
            submitted={submitted}
          />
          <OfferOptionsEditor
            offer={offer}
            delaySeconds={delaySeconds}
            onPageRequiredSeconds={onPageRequiredSeconds}
            enableEscClose={enableEscClose}
            enableMaskClose={enableMaskClose}
            showNotificationBanner={showNotificationBanner}
            enableProductLinks={enableProductLinks}
            hideOutOfStockProducts={hideOutOfStockProducts}
            enableQuantitySelection={enableQuantitySelection}
            limitQuantitySelection={limitQuantitySelection}
            productQuantityLimit={productQuantityLimit}
            hideIfItemAdded={hideIfItemAdded}
            allowWithDiscountCodes={allowWithDiscountCodes}
            submitted={submitted}
          />
        </Layout.Section>
        <Layout.Section secondary>
          <OfferSummary offer={offer} />
        </Layout.Section>
        <Layout.Section>
          <PageActions
            primaryAction={{
              content: 'Save offer',
              disabled: !dirty,
              loading: submitting,
              submit: true,
              onAction: submit
            }}
            secondaryActions={[
              {
                content: 'Cancel',
                onAction: onCancel
              }
            ]}
          />
        </Layout.Section>
      </Layout>
    </Form>
  );
};

OfferForm.propTypes = {
  initialValues: PropTypes.shape({
    offer: PropTypes.object,
    popupTheme: PropTypes.object,
    offerPopupThemes: PropTypes.array
  }),
  shop: PropTypes.object.isRequired,
  popupThemes: PropTypes.array.isRequired,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func
};

OfferForm.defaultProps = {
  initialValues: {
    offer: {},
    popupTheme: {},
    offerPopupThemes: []
  },
  onSubmit: () => {},
  onCancel: () => {}
};

export default OfferForm;
