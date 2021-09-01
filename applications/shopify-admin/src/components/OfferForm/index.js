import React, {
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect
} from 'react';
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
  onCancel,
  onDelete
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
    maximumOfferedProductQuantity,
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
    enableQuantitySelection
  } = useFields(initialOffer, showEndDate);

  const { fields, dirty, submit, submitting } = useForm({
    fields: {
      name,
      strategy,
      actionButtonBehavior,
      actionButtonLink,
      actionButtonLinkOpenInNewTab,
      triggerEvent,
      triggerExternalLinksOnly,
      triggerScrollThreshold,
      triggerPage,
      triggerPagePath,
      viewAllowance,
      viewAllowanceDays,
      triggerProducts,
      triggerCollections,
      minimumRequirement,
      minimumRequiredAmount,
      offeredProducts,
      offeredCollections,
      maximumOfferedProductQuantity,
      discountType,
      discountValue,
      discountTitle,
      geotargetingCountries,
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
      animation
    },
    makeCleanAfterSubmit: true,
    onSubmit: async (formValues) => {
      contextualSaveBar.set({ saveAction: { loading: true } });

      try {
        formValues._id = initialOffer._id;

        await onSubmit({
          offer: formValues,
          popupTheme,
          offerPopupThemes
        });
      } catch (error) {
        return { status: 'fail', errors: error };
      }

      contextualSaveBar.set({ saveAction: { loading: false } });
      contextualSaveBar.dispatch(ContextualSaveBar.Action.HIDE);

      return { status: 'success' };
    }
  });

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    submit();

    const firstErrorElement = document.querySelector('.Polaris-InlineError');

    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [submit]); // eslint-disable-line react-hooks/exhaustive-deps

  const popupThemeDirty = useMemo(
    () => JSON.stringify(popupTheme) !== JSON.stringify(initialPopupTheme),
    [popupTheme, initialPopupTheme]
  );

  contextualSaveBar = useMemo(
    () =>
      ContextualSaveBar.create(app, {
        saveAction: {
          disabled: !dirty && !popupThemeDirty,
          loading: submitting
        },
        discardAction: {
          disabled: false,
          loading: false,
          discardConfirmationModal: dirty || popupThemeDirty
        }
      }),
    [app, dirty, popupThemeDirty, submitting]
  );

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

    if (value !== 'CROSS_SELL') {
      maximumOfferedProductQuantity.onChange(undefined);
    }

    // Bundling is only available with cross-selling.
    if (value !== 'CROSS_SELL') {
      enableBundling.onChange(false);
    }

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

  const handleDiscard = () => {
    contextualSaveBar.dispatch(ContextualSaveBar.Action.DISCARD);
  };

  // Handle Contextual Save Bar behavior.
  useEffect(() => {
    const unsubscribeDiscard = contextualSaveBar.subscribe(
      ContextualSaveBar.Action.DISCARD,
      () => {
        contextualSaveBar.dispatch(ContextualSaveBar.Action.HIDE);
        onCancel();
      }
    );

    const unsubscribeSave = contextualSaveBar.subscribe(
      ContextualSaveBar.Action.SAVE,
      handleSubmit
    );

    return () => {
      unsubscribeDiscard();
      unsubscribeSave();
    };
  }, [contextualSaveBar, onCancel, handleSubmit]);

  useEffect(() => {
    if (dirty) {
      contextualSaveBar.dispatch(ContextualSaveBar.Action.SHOW);
    } else {
      contextualSaveBar.dispatch(ContextualSaveBar.Action.HIDE);
    }
  }, [contextualSaveBar, dirty]);

  useEffect(() => {
    return () => {
      contextualSaveBar.unsubscribe();
      contextualSaveBar.dispatch(ContextualSaveBar.Action.HIDE);
    };
  }, [contextualSaveBar]);

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
            offer={offer}
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
            maximumOfferedProductQuantity={maximumOfferedProductQuantity}
            submitted={submitted}
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
              disabled: !dirty && !popupThemeDirty,
              loading: submitting,
              submit: true,
              onAction: handleSubmit
            }}
            secondaryActions={[
              offer._id
                ? {
                    content: 'Delete offer',
                    onAction: onDelete,
                    destructive: true
                  }
                : {
                    content: 'Discard',
                    onAction: handleDiscard
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
  onCancel: PropTypes.func,
  onDelete: PropTypes.func
};

OfferForm.defaultProps = {
  initialValues: {
    offer: {},
    popupTheme: {},
    offerPopupThemes: []
  },
  onSubmit: () => {},
  onCancel: () => {},
  onDelete: () => {}
};

export default OfferForm;
