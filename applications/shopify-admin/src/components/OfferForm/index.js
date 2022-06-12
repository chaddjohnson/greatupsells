import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect
} from 'react';
import PropTypes from 'prop-types';
import { Form, Layout, PageActions, Sticky } from '@shopify/polaris';
import { useForm, getValues } from '@shopify/react-form';
import { ContextualSaveBar } from '@shopify/app-bridge/actions';
import { useAppBridge } from '@shopify/app-bridge-react';
import styled from 'styled-components';
import { omit } from 'lodash';
import { OfferPopup } from '@greatupsells/react-components';
import { useInterval } from '@greatupsells/react-hooks';
import { useThemeComponent } from '../../hooks';
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

  // Define an internal ID for unsaved themes.
  return Object.defineProperty(object, '__id_offerForm', {
    value: ++themeCount,
    enumerable: false
  });
};

const assignIds = (objects) => {
  return objects.map(assignId);
};

const PreviewOfferPopupContainer = styled.div`
  display: flex;
  justify-content: center;
  height: ${(props) =>
    props.previewContentHeight ? `${props.previewContentHeight}px` : '300px'};
  overflow: hidden;
`;

const SmallPreviewOfferPopupContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: white;
  margin-top: 1rem;
  height: ${(props) =>
    props.smallPreviewContentHeight
      ? `${props.smallPreviewContentHeight}px`
      : '300px'};
  overflow: hidden;

  iframe {
    min-width: 0;
  }
`;

const OfferForm = ({
  initialValues: {
    offer: initialOffer,
    theme: initialTheme,
    offerThemes: initialOfferThemes
  },
  shop,
  themes,
  onSubmit,
  onCancel,
  onDelete
}) => {
  let contextualSaveBar = null;

  const app = useAppBridge();

  const offerPopupContext = useRef();

  const [submitted, setSubmitted] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [designMode, setDesignMode] = useState(true);
  const [previewActive, setPreviewActive] = useState(false);
  const [theme, setTheme] = useState(assignId(initialTheme));
  const [offerThemes, setOfferThemes] = useState(assignIds(initialOfferThemes));
  const [themeDirty, setThemeDirty] = useState(false);
  const [themeDisplayType, setThemeDisplayType] = useState(
    window.innerWidth >= 768 ? 'desktop' : 'mobile'
  );
  const [previewContentHeight, setPreviewContentHeight] = useState();
  const [smallPreviewContentHeight, setSmallPreviewContentHeight] = useState();
  const [themeIncompatible, setThemeIncompatible] = useState(false);

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
    maximumAcceptedProductQuantity,
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
      maximumAcceptedProductQuantity,
      discountType,
      discountValue,
      discountTitle,
      geotargetingCountries,
      startAt,
      endAt,
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
        await onSubmit({
          offer: {
            ...initialOffer,
            ...formValues
          },
          theme,
          offerThemes
        });
      } catch (error) {
        return { status: 'fail', errors: error };
      }

      setThemeDirty(false);

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

  contextualSaveBar = useMemo(
    () =>
      ContextualSaveBar.create(app, {
        saveAction: {
          disabled: (!dirty && !themeDirty) || themeIncompatible,
          loading: submitting
        },
        discardAction: {
          disabled: false,
          loading: false,
          discardConfirmationModal: dirty || themeDirty
        }
      }),
    [app, dirty, themeDirty, submitting, themeIncompatible]
  );

  const offer = useMemo(
    () => ({
      ...initialOffer,
      ...getValues(fields)
    }),
    [initialOffer, fields]
  );

  const ThemeComponent = useThemeComponent(theme?.key);

  const copyTheme = (value) => {
    return assignId({
      ...omit(value, ['_id', '__v', 'updatedAt', 'createdAt']),
      offer: offer._id
    });
  };

  const dummyData =
    offer.strategy === 'UPSELL' ? dummyUpsellData : dummyCrossSellData;
  const isInline = ['POST_PURCHASE', 'THANK_YOU_PAGE'].includes(offer.strategy);
  const designModeZoom = isInline ? 1.0 : 0.79;
  const smallDesignModeZoom = isInline ? 0.5 : 0.4;

  const updatePreviewContentHeight = useCallback(() => {
    const context = offerPopupContext?.current;
    const container = context?.querySelector('.content-container');

    if (!context || !container) {
      return;
    }

    // Workaround to ensure preview area fits iframe.
    setPreviewContentHeight(container.offsetHeight * designModeZoom + 16);
    setSmallPreviewContentHeight(
      container.offsetHeight * smallDesignModeZoom + 8
    );
  }, [offerPopupContext, designModeZoom, smallDesignModeZoom]);

  const handleStrategyChange = (value) => {
    const selectedThemeUsesSelectedStrategy =
      theme?.strategies.indexOf(value) > -1;
    const firstStrategyTheme = themes.find(
      (current) => current.strategies.indexOf(value) > -1
    );

    // Determine whether there is a theme already associated with this offer for the selected strategy.
    let firstStrategyOfferTheme = offerThemes.find(
      (current) => current.strategies.indexOf(value) > -1
    );

    strategy.onChange(value);

    if (value !== 'CROSS_SELL') {
      maximumAcceptedProductQuantity.onChange(undefined);
    }

    // Bundling is only available with cross-selling.
    if (value !== 'CROSS_SELL') {
      enableBundling.onChange(false);
    }

    // If there is not yet a theme associated with the offer for the selected
    // strategy, then copy the first available theme for that strategy.
    if (!firstStrategyOfferTheme && firstStrategyTheme) {
      firstStrategyOfferTheme = copyTheme(firstStrategyTheme);

      // Copy over changes to the current theme to history.
      setOfferThemes([firstStrategyOfferTheme, ...offerThemes]);
    }

    // Switch to the first strategy theme.
    if (firstStrategyOfferTheme && !selectedThemeUsesSelectedStrategy) {
      setTheme(firstStrategyOfferTheme);
    }

    if (!shop.onlineStore2Theme && value === 'POST_PURCHASE') {
      setThemeIncompatible(true);
    }

    // Use page load as trigger event for Thank You Page offers.
    if (value === 'THANK_YOU_PAGE') {
      triggerEvent.onChange('LOAD');
    }
  };

  const handleThemeChange = (value) => {
    setTheme(value);
    setOfferThemes([
      ...offerThemes.map((current) =>
        current.__id_offerForm === value.__id_offerForm ? value : current
      )
    ]);
    setThemeDirty(true);
    setTimeout(() => updatePreviewContentHeight());
  };

  const handleThemeSelect = (value) => {
    const copiedTheme = copyTheme(value);

    // Make a copy of the theme and add it as history for the offer, and then
    // copy over changes to the current theme to history.
    setOfferThemes([copiedTheme, ...offerThemes]);

    // Use the copied theme.
    setTheme(copiedTheme);

    setThemeDirty(true);

    setTimeout(() => updatePreviewContentHeight());
  };

  const handleOfferThemeSelect = (value) => {
    setTheme(value);
    setThemeDirty(true);

    setTimeout(() => updatePreviewContentHeight());

    const newMaximumOfferedProductQuantity =
      value.maximumOfferedProductQuantity || 3;

    maximumOfferedProductQuantity.onChange(
      newMaximumOfferedProductQuantity.toString()
    );
  };

  const handleThemeDisplayTypeChange = (value) => {
    setThemeDisplayType(value);

    setTimeout(() => updatePreviewContentHeight());
  };

  const handleClosePreview = () => {
    setPreviewActive(false);
    setTimeout(() => setDesignMode(true));
    setTimeout(() => updatePreviewContentHeight());
  };

  const handlePreview = () => {
    setDesignMode(false);
    setTimeout(() => setPreviewActive(true));
    setTimeout(() => updatePreviewContentHeight());
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
    if (dirty || themeDirty) {
      contextualSaveBar.dispatch(ContextualSaveBar.Action.SHOW);
    } else {
      contextualSaveBar.dispatch(ContextualSaveBar.Action.HIDE);
    }
  }, [contextualSaveBar, dirty, themeDirty]);

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

  useEffect(() => {
    updatePreviewContentHeight();
  }, [updatePreviewContentHeight, offer, theme]);

  useInterval(() => {
    updatePreviewContentHeight();
  }, 0.5);

  return (
    <Form noValidate onSubmit={submit}>
      <Layout>
        <Layout.Section>
          <OfferNameEditor name={name} submitted={submitted} />
          <OfferStrategyEditor
            shop={shop}
            strategy={strategy}
            onStrategyChange={handleStrategyChange}
          />
          <ThemeEditor
            strategy={offer.strategy}
            theme={theme}
            themes={themes}
            offerThemes={offerThemes}
            displayType={themeDisplayType}
            previewElement={
              <PreviewOfferPopupContainer
                previewContentHeight={previewContentHeight}
              >
                <OfferPopup
                  contextRef={offerPopupContext}
                  open={designMode || previewActive}
                  designMode={designMode}
                  designModeZoom={designModeZoom}
                  forceDisplayType={
                    !previewActive ? themeDisplayType : undefined
                  }
                  shop={shop}
                  theme={theme}
                  ThemeComponent={ThemeComponent}
                  offer={offer}
                  locale="en"
                  countryCode="US"
                  currency="USD"
                  triggerProduct={dummyData.triggerProduct}
                  offeredProducts={dummyData.offeredProducts}
                  onClose={handleClosePreview}
                  onClick={!isInline ? handlePreview : undefined}
                />
              </PreviewOfferPopupContainer>
            }
            onPreview={!isInline ? handlePreview : undefined}
            onChange={handleThemeChange}
            onThemeSelect={handleThemeSelect}
            onOfferThemeSelect={handleOfferThemeSelect}
            onDisplayTypeChange={handleThemeDisplayTypeChange}
          />
          <OfferTriggerEventEditor
            offer={offer}
            triggerEvent={triggerEvent}
            triggerExternalLinksOnly={triggerExternalLinksOnly}
            triggerScrollThreshold={triggerScrollThreshold}
            submitted={submitted}
          />
          <OfferPagesEditor
            offer={offer}
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
            offer={offer}
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
            theme={theme}
            offeredProducts={offeredProducts}
            offeredCollections={offeredCollections}
            maximumOfferedProductQuantity={maximumOfferedProductQuantity}
            maximumAcceptedProductQuantity={maximumAcceptedProductQuantity}
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
            <SmallPreviewOfferPopupContainer
              smallPreviewContentHeight={smallPreviewContentHeight}
            >
              <OfferPopup
                open={designMode && !previewActive}
                designMode={true}
                designModeZoom={smallDesignModeZoom}
                forceDisplayType={!previewActive ? themeDisplayType : undefined}
                shop={shop}
                theme={theme}
                ThemeComponent={ThemeComponent}
                offer={offer}
                locale="en"
                countryCode="US"
                currency="USD"
                triggerProduct={dummyData.triggerProduct}
                offeredProducts={dummyData.offeredProducts}
                onClose={handleClosePreview}
                onClick={!isInline ? handlePreview : undefined}
              />
            </SmallPreviewOfferPopupContainer>
          </Sticky>
        </Layout.Section>
        <Layout.Section>
          <PageActions
            primaryAction={{
              content: 'Save offer',
              disabled: (!dirty && !themeDirty) || themeIncompatible,
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
    theme: PropTypes.object,
    offerThemes: PropTypes.array
  }),
  shop: PropTypes.object.isRequired,
  themes: PropTypes.array.isRequired,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  onDelete: PropTypes.func
};

OfferForm.defaultProps = {
  initialValues: {
    offer: {},
    theme: {},
    offerThemes: []
  },
  onSubmit: () => {},
  onCancel: () => {},
  onDelete: () => {}
};

export default OfferForm;
