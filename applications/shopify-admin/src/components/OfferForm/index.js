import React, { useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Layout,
  Card,
  TextStyle,
  PageActions,
  Sticky
} from '@shopify/polaris';
import { useForm, getValues } from '@shopify/react-form';
import { ContextualSaveBar } from '@shopify/app-bridge/actions';
import { Context as AppBridgeContext } from '@shopify/app-bridge-react';
import styled from 'styled-components';
import { omit } from 'lodash';
import { OfferPopup } from '@neatowebsolutions/upselling-react-components';
import useFields from './fields';
import OfferSummary from './OfferSummary';
import ThemeEditor from './ThemeEditor';
import OfferNameEditor from './OfferNameEditor';
import OfferStrategyEditor from './OfferStrategyEditor';
import OfferTriggerEventEditor from './OfferTriggerEventEditor';
import OfferPagesEditor from './OfferPagesEditor';
import OfferViewAllowanceEditor from './OfferViewAllowanceEditor';
import OfferActionButtonEditor from './OfferActionButtonEditor';
import OfferTriggerProductsEditor from './OfferTriggerProductsEditor';
import OfferOfferedProductsEditor from './OfferOfferedProductsEditor';
import OfferDiscountEditor from './OfferDiscountEditor';
import OfferBundlingEditor from './OfferBundlingEditor';
import OfferDatesEditor from './OfferDatesEditor';
import OfferGeotargetingEditor from './OfferGeotargetingEditor';
import OfferOptionsEditor from './OfferOptionsEditor';
import dummyCrossSellData from './dummyCrossSellData.json';
import dummyUpsellData from './dummyUpsellData.json';

let themeCount = 0;

const assignId = (object) => {
  if (!object) {
    return object;
  }

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
  display: flex;
  justify-content: center;
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
  let contextualSaveBar = null;

  const app = useContext(AppBridgeContext);

  const [submitted, setSubmitted] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [designMode, setDesignMode] = useState(true);
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
    triggerPage,
    triggerPagePath,
    discountType,
    discountValue,
    discountTitle,
    minimumRequirement,
    minimumRequiredAmount,
    offeredProducts,
    offeredCollections,
    triggerProducts,
    triggerCollections,
    geotargetingCountries,
    animation,
    actionButtonBehavior,
    actionButtonLink,
    actionButtonLinkOpenInNewTab,
    viewAllowance,
    viewAllowanceDays,
    startAt,
    endAt,
    disableOutOfStockVariants,
    delaySeconds,
    onPageRequiredSeconds,
    enableEscClose,
    enableMaskClose,
    enableBundling,
    enableVariantSelection,
    enableQuantitySelection,
    hideIfItemAdded
  } = useFields(initialOffer, showEndDate);

  const { fields, dirty, submit, submitting /* submitErrors */ } = useForm({
    fields: {
      name,
      strategy,
      triggerEvent,
      triggerExternalLinksOnly,
      triggerScrollThreshold,
      triggerPage,
      triggerPagePath,
      minimumRequirement,
      minimumRequiredAmount,
      offeredProducts,
      offeredCollections,
      discountType,
      discountValue,
      discountTitle,
      triggerProducts,
      triggerCollections,
      geotargetingCountries,
      animation,
      actionButtonBehavior,
      actionButtonLink,
      actionButtonLinkOpenInNewTab,
      viewAllowance,
      viewAllowanceDays,
      startAt,
      endAt,
      disableOutOfStockVariants,
      delaySeconds,
      onPageRequiredSeconds,
      enableEscClose,
      enableMaskClose,
      enableBundling,
      enableVariantSelection,
      enableQuantitySelection,
      hideIfItemAdded
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

  const dummyData =
    offer.strategy === 'UPSELL' ? dummyUpsellData : dummyCrossSellData;

  const handleStrategyChange = (value) => {
    const selectedThemeUsesSelectedStrategy =
      popupTheme.strategies.indexOf(value) > -1;
    const firstStrategyPopupTheme = popupThemes.find(
      (current) => current.strategies.indexOf(value) > -1
    );

    // Determine whether there is a theme already associated with this offer for the selected strategy.
    let firstStrategyOfferPopupTheme = offerPopupThemes.find(
      (current) => current.strategies.indexOf(value) > -1
    );

    strategy.onChange(value);

    // If there is not yet a theme associated with the offer for the selected
    // strategy, then copy the first available theme for that strategy.
    if (!firstStrategyOfferPopupTheme && firstStrategyPopupTheme) {
      firstStrategyOfferPopupTheme = copyTheme(firstStrategyPopupTheme);

      // Copy over changes to the current theme to history.
      setOfferPopupThemes([firstStrategyOfferPopupTheme, ...offerPopupThemes]);
    }

    // Switch to the first strategy theme.
    if (firstStrategyOfferPopupTheme && !selectedThemeUsesSelectedStrategy) {
      setPopupTheme(firstStrategyOfferPopupTheme);
    }

    // Bundling is only available with cross-selling.
    if (value !== 'CROSS_SELL') {
      enableBundling.onChange(false);
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

  const handleClosePreview = () => {
    setPreviewActive(false);
    setTimeout(() => setDesignMode(true));
  };

  const handlePreview = () => {
    setDesignMode(false);
    setTimeout(() => setPreviewActive(true));
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
          <OfferNameEditor name={name} submitted={submitted} />
          <OfferStrategyEditor
            strategy={strategy}
            onStrategyChange={handleStrategyChange}
          />
          <OfferTriggerEventEditor
            triggerEvent={triggerEvent}
            triggerExternalLinksOnly={triggerExternalLinksOnly}
            triggerScrollThreshold={triggerScrollThreshold}
            submitted={submitted}
          />
          <OfferPagesEditor
            triggerPage={triggerPage}
            triggerPagePath={triggerPagePath}
            submitted={submitted}
          />
          <OfferViewAllowanceEditor
            viewAllowance={viewAllowance}
            viewAllowanceDays={viewAllowanceDays}
            submitted={submitted}
          />
          <OfferActionButtonEditor
            actionButtonBehavior={actionButtonBehavior}
            actionButtonLink={actionButtonLink}
            actionButtonLinkOpenInNewTab={actionButtonLinkOpenInNewTab}
            submitted={submitted}
          />
          <OfferTriggerProductsEditor
            shop={shop}
            triggerProducts={triggerProducts}
            triggerCollections={triggerCollections}
            minimumRequirement={minimumRequirement}
            minimumRequiredAmount={minimumRequiredAmount}
            submitted={submitted}
          />
          <OfferOfferedProductsEditor
            offer={offer}
            offeredProducts={offeredProducts}
            offeredCollections={offeredCollections}
          />
          <OfferDiscountEditor
            shop={shop}
            offer={offer}
            discountType={discountType}
            discountValue={discountValue}
            discountTitle={discountTitle}
            submitted={submitted}
          />
          <OfferBundlingEditor offer={offer} enableBundling={enableBundling} />
          <ThemeEditor
            strategy={offer.strategy}
            theme={popupTheme}
            themes={popupThemes}
            offerThemes={offerPopupThemes}
            displayType={themeDisplayType}
            previewElement={
              <OfferPopupContainer>
                <OfferPopup
                  open={designMode || previewActive}
                  designMode={designMode}
                  designModeZoom={0.8}
                  forceDisplayType={
                    !previewActive ? themeDisplayType : undefined
                  }
                  shop={shop}
                  theme={popupTheme}
                  offer={offer}
                  triggerProduct={dummyData.triggerProduct}
                  offeredProducts={dummyData.offeredProducts}
                  onClose={handleClosePreview}
                  onClick={handlePreview}
                />
              </OfferPopupContainer>
            }
            onPreview={handlePreview}
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
            geotargetingCountries={geotargetingCountries}
            submitted={submitted}
          />
          <OfferOptionsEditor
            offer={offer}
            enableVariantSelection={enableVariantSelection}
            enableQuantitySelection={enableQuantitySelection}
            disableOutOfStockVariants={disableOutOfStockVariants}
            delaySeconds={delaySeconds}
            onPageRequiredSeconds={onPageRequiredSeconds}
            enableEscClose={enableEscClose}
            enableMaskClose={enableMaskClose}
            animation={animation}
            hideIfItemAdded={hideIfItemAdded}
            submitted={submitted}
            onPreview={handlePreview}
          />
        </Layout.Section>
        <Layout.Section secondary>
          <Sticky offset={16} disableWhenStacked={true}>
            <OfferSummary offer={offer} />
            {discountType.value !== 'NO_DISCOUNT' && (
              <Card subdued>
                <Card.Section title="Can't combine with discounts">
                  <TextStyle variation="subdued">
                    Customers won&apos;t be able to enter a discount code or use
                    an automatic discount if this offer is accepted.
                  </TextStyle>
                </Card.Section>
              </Card>
            )}
          </Sticky>
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
