import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo
} from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Layout,
  Card,
  FormLayout,
  ChoiceList,
  Checkbox,
  TextField,
  Icon,
  Button,
  PageActions,
  Sticky
} from '@shopify/polaris';
import { SearchMinor } from '@shopify/polaris-icons';
import {
  useForm,
  useField,
  asChoiceField,
  useList,
  notEmpty,
  getValues
} from '@shopify/react-form';
import { ContextualSaveBar } from '@shopify/app-bridge/actions';
import {
  Context as AppBridgeContext,
  ResourcePicker
} from '@shopify/app-bridge-react';
import styled from 'styled-components';
import moment from 'moment-timezone';
import scrollToComponent from 'react-scroll-to-component';
import DateTimePicker from './DateTimePicker';
import ManagedResourceList from './ManagedResourceList';
import OfferSummary from './OfferSummary';
import PopupThemeCustomization from './PopupThemeCustomization';
import PopupThemeSelection from './PopupThemeSelection';

const { OfferPopup } =
  (typeof window !== 'undefined' &&
    require('@neatowebsolutions/upselling-react-components')) ||
  {};

const timezone = moment.tz.guess();
const timezoneAbbreviation = moment.tz(timezone).format('z');

const product = {
  title: 'Example Product',
  price: 14.99,
  salePrice: 12.99
  // ...
};

const SummaryContainer = styled.div`
  .Polaris-Card__Section:last-child {
    display: none;
  }

  @media (min-width: 804px) {
    .Polaris-Card__Section:last-child {
      display: block;
    }
  }
`;

const OfferPopupSummaryContainer = styled.div`
  zoom: 35%;
  margin-top: 8px;

  > div {
    position: static;
  }
`;

const OfferPopupContainer = styled.div`
  > div {
    position: static;
  }
`;

const OfferForm = ({ initialValues, onSubmit, onCancel }) => {
  const app = useContext(AppBridgeContext);

  const [submitted, setSubmitted] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [collectionPickerOpen, setCollectionPickerOpen] = useState(false);
  const [triggerProductPickerOpen, setTriggerProductPickerOpen] = useState(
    false
  );
  const [
    triggerCollectionPickerOpen,
    setTriggerCollectionPickerOpen
  ] = useState(false);

  const offerPopupSummaryContainer = useRef();
  const offerPopupContainer = useRef();

  let contextualSaveBar = null;

  const name = useField({
    value: initialValues.name,
    validates: [notEmpty("Name can't be blank")]
  });
  const strategy = useField(initialValues.strategy);
  const triggerEvent = useField(initialValues.triggerEvent);
  const discountType = useField(initialValues.discountType);
  const products = useField(useList(initialValues.products));
  const collections = useField(useList(initialValues.collections));
  const triggerProducts = useField(useList(initialValues.triggerProducts));
  const triggerCollections = useField(
    useList(initialValues.triggerCollections)
  );
  const actionButtonBehavior = useField(initialValues.actionButtonBehavior);
  const showNotificationBanner = useField(initialValues.showNotificationBanner);
  const callToActionText = useField({
    value: initialValues.callToActionText,
    validates: [notEmpty("Call to action text can't be blank")]
  });
  const actionButtonText = useField({
    value: initialValues.actionButtonText,
    validates: [notEmpty("Action text can't be blank")]
  });
  const cancelButtonText = useField({
    value: initialValues.cancelButtonText,
    validates: [notEmpty("Cancel button text can't be blank")]
  });
  const successMessageText = useField(
    {
      value: initialValues.successMessageText,
      validates: (value) => {
        if (showNotificationBanner.value && !value) {
          return "Success message text can't be blank";
        }
      }
    },
    [showNotificationBanner.value]
  );
  const popupThemeType = useField(initialValues.popupThemeType);
  const popupThemeTemplateId = useField(initialValues.popupThemeTemplateId);
  const popupTheme = useField(initialValues.popupTheme);
  const startAt = useField({
    value: initialValues.startAt,
    validates: [
      notEmpty("Start date can't be blank"),
      (value) => {
        if (value && Number.isNaN(new Date(value))) {
          return 'Start date must be valid';
        }
      }
    ]
  });
  const endAt = useField(
    {
      value: initialValues.endAt,
      validates: [
        (value) => {
          if (showEndDate && !value) {
            return "End date can't be blank";
          }
        },
        (value) => {
          if (value && Number.isNaN(new Date(value))) {
            return 'End date must be valid';
          }
        },
        (value) => {
          if (
            showEndDate &&
            value &&
            startAt.value &&
            new Date(value) < new Date(startAt.value)
          ) {
            return 'End date must be on or after start date';
          }
        }
      ]
    },
    [showEndDate, startAt.value]
  );
  const enableTimer = useField(initialValues.enableTimer);
  const enableProductLinks = useField(initialValues.enableProductLinks);
  const hideOutOfStockProducts = useField(initialValues.hideOutOfStockProducts);
  const enableQuantitySelection = useField(
    initialValues.enableQuantitySelection
  );
  const limitQuantitySelection = useField(initialValues.limitQuantitySelection);
  const productQuantityLimit = useField(
    {
      value: initialValues.productQuantityLimit,
      validates: [
        (value) => {
          if (limitQuantitySelection.value && !value) {
            return "Product quantity limit can't be blank";
          }
        },
        (value) => {
          if (value && Number.isNaN(value)) {
            return 'Product quantity limit must be a number';
          }
        },
        (value) => {
          if (value && Number(value) < 1) {
            return 'Product quantity limit must be a positive value';
          }
        },
        (value) => {
          if (value && Number(value) % 1 !== 0) {
            return 'Invalid value.';
          }
        }
      ]
    },
    [limitQuantitySelection.value]
  );
  const allowMultipleUpsells = useField(initialValues.allowMultipleUpsells);
  const hideIfItemAdded = useField(initialValues.hideIfItemAdded);
  const allowWithDiscountCodes = useField(initialValues.allowWithDiscountCodes);

  const { fields, dirty, submit, submitting, submitErrors } = useForm({
    fields: {
      name,
      strategy,
      triggerEvent,
      discountType,
      products,
      // minimumProductsQuantity,
      collections,
      triggerProducts,
      triggerCollections,
      actionButtonBehavior,
      showNotificationBanner,
      callToActionText,
      actionButtonText,
      cancelButtonText,
      successMessageText,
      popupThemeType,
      popupThemeTemplateId,
      popupTheme,
      startAt,
      endAt,
      enableTimer,
      enableProductLinks,
      hideOutOfStockProducts,
      enableQuantitySelection,
      limitQuantitySelection,
      productQuantityLimit,
      allowMultipleUpsells,
      hideIfItemAdded,
      allowWithDiscountCodes
    },
    onSubmit: async (formValues) => {
      // contextualSaveBar.set({ saveAction: { loading: true } });
      setSubmitted(true);

      try {
        // TODO: Handle update.
        await onSubmit(formValues);
      } catch (error) {
        return { status: 'fail', errors: error };
      }

      // contextualSaveBar.dispatch(ContextualSaveBar.Action.HIDE);

      // TODO: Redirect to offers/:id page.

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
      ...initialValues,
      ...getValues(fields)
    }),
    [initialValues, fields]
  );

  // Work around focus issues.
  const handleBlur = useCallback(
    (fieldName) => (event) => {
      const field = fields[fieldName];

      if (event && event.target && field) {
        setTimeout(() => field.onBlur(event), 0);
      }
    },
    [fields]
  );

  const handleActionButtonBehaviorChange = useCallback(
    (behavior) => {
      actionButtonBehavior.onChange(behavior);

      if (behavior === 'CART') {
        actionButtonText.onChange('Add to cart');
      } else if (behavior === 'CHECKOUT') {
        actionButtonText.onChange('Checkout');
      } else {
        actionButtonText.onChange('Continue shopping');
      }
    },
    [actionButtonBehavior, actionButtonText]
  );

  const handleStartAtChange = useCallback(
    (value) => {
      startAt.onChange(value);

      if (
        showEndDate &&
        offer.endAt &&
        value &&
        new Date(offer.endAt) < new Date(value)
      ) {
        endAt.onChange(value);
      }
    },
    [endAt, offer.endAt, showEndDate, startAt]
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showEndDate]
  );

  return (
    <Form noValidate onSubmit={submit}>
      <Layout>
        <Layout.Section>
          <Card title="Offer name" sectioned>
            <FormLayout>
              <TextField
                placeholder="Buy one get one 10% off"
                helpText="Internal name for your reference."
                {...name}
                error={submitted && name.error}
                onBlur={handleBlur('name')}
              />
            </FormLayout>
          </Card>
          <Card title="Strategy" sectioned>
            <FormLayout>
              <ChoiceList
                choices={[
                  {
                    label: 'Upsell',
                    value: 'UPSELL',
                    helpText:
                      'Encourage customers to buy related or complementary products.'
                  },
                  {
                    label: 'Cross-sell',
                    value: 'CROSS_SELL',
                    helpText:
                      'Encourage customers to buy comparable higher-end product.'
                  }
                ]}
                selected={strategy.value}
                onChange={([value]) => strategy.onChange(value)}
              />
            </FormLayout>
          </Card>
          <Card title="Trigger event" sectioned>
            <FormLayout>
              <ChoiceList
                choices={[
                  {
                    label: 'Add to cart',
                    value: 'ADD',
                    helpText:
                      'Offer is shown when a product is added to the cart.'
                  },
                  {
                    label: 'Cart page',
                    value: 'CART',
                    helpText: 'Offer is shown on the Cart page before checkout.'
                  },
                  {
                    label: 'Checkout page',
                    value: 'CHECKOUT',
                    helpText: 'Offer is shown on the Checkout page.'
                  }
                ]}
                selected={triggerEvent.value}
                onChange={([value]) => triggerEvent.onChange(value)}
              />
            </FormLayout>
          </Card>
          <Card title="Discount type" sectioned>
            <FormLayout>
              <ChoiceList
                choices={[
                  {
                    label: 'Percentage off',
                    value: 'PERCENTAGE'
                  },
                  {
                    label: 'USD off',
                    value: 'USD'
                  },
                  {
                    label: 'Set price',
                    value: 'SET_PRICE'
                  },
                  {
                    label: 'No discount',
                    value: 'NO_DISCOUNT'
                  }
                ]}
                selected={discountType.value}
                onChange={([value]) => discountType.onChange(value)}
              />
            </FormLayout>
          </Card>
          <Card
            title={`Products and collections to ${
              offer.strategy === 'UPSELL' ? 'upsell' : 'cross-sell'
            }`}
          >
            <Card.Section title="Products">
              <TextField
                helpText={`Selected products will be selected at random and offered as ${
                  offer.strategy === 'UPSELL' ? 'upsell' : 'cross-sell'
                }s.`}
                placeholder="Search products"
                prefix={<Icon source={SearchMinor} />}
                connectedRight={
                  <Button onClick={() => setProductPickerOpen(true)}>
                    Browse
                  </Button>
                }
                onChange={() => setProductPickerOpen(true)}
              />
              <ManagedResourceList
                items={offer.products}
                // onChange={}
                // onItemRemoved={products => setOffer({ ...offer, products })}
              />
            </Card.Section>
            <Card.Section title="Collections">
              <TextField
                helpText={`Products from selected collections will be selected at random and offered as ${
                  offer.strategy === 'UPSELL' ? 'upsell' : 'cross-sell'
                }s.`}
                placeholder="Search collections"
                prefix={<Icon source={SearchMinor} />}
                connectedRight={
                  <Button onClick={() => setCollectionPickerOpen(true)}>
                    Browse
                  </Button>
                }
                onChange={() => setCollectionPickerOpen(true)}
              />
              <ManagedResourceList
                items={offer.collections}
                // onChange={}
                // onItemRemoved={collections => setOffer({ ...offer, collections })}
              />
            </Card.Section>
          </Card>
          <Card title="Triggers">
            <Card.Section title="Products">
              <TextField
                helpText="The popup will show when any selected products are in the cart."
                placeholder="Search products"
                prefix={<Icon source={SearchMinor} />}
                connectedRight={
                  <Button onClick={() => setTriggerProductPickerOpen(true)}>
                    Browse
                  </Button>
                }
                onChange={() => setTriggerProductPickerOpen(true)}
              />
              <ManagedResourceList
                items={offer.triggerProducts}
                // onChange={triggerProducts.onChange}
                // onItemRemoved={triggerProducts => setOffer({ ...offer, triggerProducts })}
              />
            </Card.Section>
            <Card.Section title="Collections">
              <TextField
                helpText="The popup will show when any products from selected collections are in the cart."
                placeholder="Search collections"
                prefix={<Icon source={SearchMinor} />}
                connectedRight={
                  <Button onClick={() => setTriggerCollectionPickerOpen(true)}>
                    Browse
                  </Button>
                }
                onChange={() => setTriggerCollectionPickerOpen(true)}
              />
              <ManagedResourceList
                items={offer.triggerCollections}
                // onChange={triggerCollections.onChange}
                // onItemRemoved={triggerCollections => setOffer({ ...offer, triggerCollections })}
              />
            </Card.Section>
            <Card.Section title="Minimum requirements">
              <FormLayout>
                <ChoiceList
                  choices={[
                    {
                      label: 'None',
                      value: 'NONE'
                    },
                    {
                      label: 'Minimum purchase amount ($)',
                      value: 'AMOUNT'
                    },
                    {
                      label: 'Minimum quantity of items',
                      value: 'QUANTITY'
                    }
                  ]}
                  selected="NONE"
                />
              </FormLayout>
            </Card.Section>
          </Card>
          <Card title="Action button behavior" sectioned>
            <ChoiceList
              choices={[
                {
                  label: 'Redirect customers to the Cart page',
                  value: 'CART'
                },
                {
                  label:
                    'Skip the cart and take customers directly to the Checkout page',
                  value: 'CHECKOUT',
                  helpText:
                    'Immediately initiating checkout can increase conversions.'
                },
                {
                  label: 'Remain on the same page',
                  value: 'PAGE'
                }
              ]}
              selected={actionButtonBehavior.value}
              onChange={([value]) => handleActionButtonBehaviorChange(value)}
            />
          </Card>
          <Card title="Popup">
            <Card.Section title="Settings">
              <FormLayout>
                <TextField
                  label="Call to action text"
                  labelAction={{ content: 'Variables reference' }}
                  placeholder="Buy one get one 10% off"
                  {...callToActionText}
                  error={submitted && callToActionText.error}
                  onBlur={handleBlur('callToActionText')}
                />
                <TextField
                  label="Action button text"
                  placeholder="Add to cart"
                  {...actionButtonText}
                  error={submitted && actionButtonText.error}
                  onBlur={handleBlur('actionButtonText')}
                />
                <TextField
                  label="Cancel button text"
                  placeholder="No thanks"
                  {...cancelButtonText}
                  error={submitted && cancelButtonText.error}
                  onBlur={handleBlur('cancelButtonText')}
                />
                <TextField
                  label="Success message text"
                  labelAction={{ content: 'Variables reference' }}
                  helpText="This displays in the banner after a customer accepts an offer."
                  placeholder="You saved 10%!"
                  disabled={!offer.showNotificationBanner}
                  {...successMessageText}
                  error={
                    submitted &&
                    offer.showNotificationBanner &&
                    successMessageText.error
                  }
                  onBlur={handleBlur('successMessageText')}
                />
              </FormLayout>
            </Card.Section>
            <Card.Section title="Theme">
              <ChoiceList
                choices={[
                  {
                    label: 'Use a template',
                    value: 'TEMPLATE'
                  },
                  {
                    label: 'Customize',
                    value: 'CUSTOM'
                  }
                ]}
                selected={popupThemeType.value}
                onChange={([value]) => popupThemeType.onChange(value)}
              />
              <Card.Section>
                {offer.popupThemeType === 'TEMPLATE' ? (
                  <PopupThemeSelection
                    popupThemeTemplateId={offer.popupThemeTemplateId}
                    onChange={popupThemeTemplateId.onChange}
                  />
                ) : (
                  <PopupThemeCustomization
                    theme={offer.popupTheme}
                    onChange={popupTheme.onChange}
                  />
                )}
              </Card.Section>
            </Card.Section>
          </Card>
          <Card title="Active dates" sectioned>
            <FormLayout>
              <DateTimePicker
                value={offer.startAt}
                datePickerProps={{ label: 'Start date' }}
                timePickerProps={{
                  label: `Start time (${timezoneAbbreviation})`,
                  placeholder: 'Enter time'
                }}
                onChange={handleStartAtChange}
              />
              <FormLayout.Group>
                <Checkbox
                  label="Set end date"
                  checked={showEndDate}
                  onChange={() => setShowEndDate(!showEndDate)}
                />
              </FormLayout.Group>
              {showEndDate && (
                <DateTimePicker
                  disableDatesBefore={new Date(offer.startAt)}
                  value={offer.endAt}
                  datePickerProps={{ label: 'End date' }}
                  timePickerProps={{
                    label: `End time (${timezoneAbbreviation})`,
                    placeholder: 'Enter time'
                  }}
                  onChange={endAt.onChange}
                />
              )}
            </FormLayout>
          </Card>
          <Card title="Timer" sectioned>
            <FormLayout>
              <Checkbox
                label="Display a countdown timer"
                {...asChoiceField(enableTimer)}
              />
              {offer.enableTimer && (
                <div>
                  <p>Text</p>
                  <p>Countdown start</p>
                </div>
              )}
            </FormLayout>
          </Card>
          <Card title="Options">
            <Card.Section title="Products">
              <FormLayout>
                <Checkbox
                  label="Enable product links"
                  {...asChoiceField(enableProductLinks)}
                />
                <Checkbox
                  label="Hide out of stock products"
                  {...asChoiceField(hideOutOfStockProducts)}
                />
                <Checkbox
                  label="Allow customers to change quantities"
                  {...asChoiceField(enableQuantitySelection)}
                />
                <Checkbox
                  label="Limit product quantity"
                  helpText={
                    offer.limitQuantitySelection && (
                      <TextField
                        type="number"
                        inputMode="numeric"
                        value={offer.productQuantityLimit}
                        min={1}
                        step={1}
                        {...productQuantityLimit}
                        error={
                          submitted &&
                          offer.limitQuantitySelection &&
                          productQuantityLimit.error
                        }
                        onBlur={handleBlur('productQuantityLimit')}
                      />
                    )
                  }
                  {...asChoiceField(limitQuantitySelection)}
                />
              </FormLayout>
            </Card.Section>
            <Card.Section title="Usage">
              <FormLayout>
                <Checkbox
                  label={`Allow the same customer to use this offer multiple times`}
                  {...asChoiceField(allowMultipleUpsells)}
                />
                <Checkbox
                  label={`Hide if customer already added ${
                    offer.strategy === 'UPSELL' ? 'an upsell' : 'a cross-sell'
                  } item`}
                  {...asChoiceField(hideIfItemAdded)}
                />
                <Checkbox
                  label="Allow use of offer with discount codes"
                  {...asChoiceField(allowWithDiscountCodes)}
                />
              </FormLayout>
            </Card.Section>
            <Card.Section title="Behavior">
              <FormLayout>
                <Checkbox
                  label={`Show notification bar on ${
                    offer.strategy === 'UPSELL' ? 'upsell' : 'cross-sell'
                  }`}
                  {...asChoiceField(showNotificationBanner)}
                />
              </FormLayout>
            </Card.Section>
          </Card>
          <Card title="Preview (full size)" sectioned subdued>
            <OfferPopupContainer ref={offerPopupContainer} />
            {offerPopupContainer && offerPopupContainer.current && (
              <OfferPopup
                appRoot="#__next"
                renderTo={offerPopupContainer.current}
                open={true}
                offer={offer}
                product={product}
              />
            )}
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Sticky offset={20}>
            <SummaryContainer>
              <Card title="Summary" subdued>
                <OfferSummary offer={offer}>
                  <Card.Section title="Preview">
                    <OfferPopupSummaryContainer
                      ref={offerPopupSummaryContainer}
                    />
                    {/* eslint-disable indent */}
                    {offerPopupSummaryContainer &&
                      offerPopupSummaryContainer.current && (
                        <OfferPopup
                          appRoot="#__next"
                          renderTo={offerPopupSummaryContainer.current}
                          open={true}
                          offer={offer}
                          product={product}
                          onClick={() =>
                            scrollToComponent(offerPopupContainer.current)
                          }
                        />
                      )}
                    {/* eslint-enable indent */}
                  </Card.Section>
                </OfferSummary>
              </Card>
            </SummaryContainer>
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
      {productPickerOpen && (
        <ResourcePicker
          resourceType="Product"
          allowMultiple={true}
          open={productPickerOpen}
          onSelection={() => setProductPickerOpen(false)}
          onCancel={() => setProductPickerOpen(false)}
        />
      )}
      {collectionPickerOpen && (
        <ResourcePicker
          resourceType="Collection"
          allowMultiple={true}
          open={collectionPickerOpen}
          onSelection={() => setCollectionPickerOpen(false)}
          onCancel={() => setCollectionPickerOpen(false)}
        />
      )}
      {triggerProductPickerOpen && (
        <ResourcePicker
          resourceType="Product"
          allowMultiple={true}
          open={triggerProductPickerOpen}
          onSelection={() => setTriggerProductPickerOpen(false)}
          onCancel={() => setTriggerProductPickerOpen(false)}
        />
      )}
      {triggerCollectionPickerOpen && (
        <ResourcePicker
          resourceType="Collection"
          allowMultiple={true}
          open={triggerCollectionPickerOpen}
          onSelection={() => setTriggerCollectionPickerOpen(false)}
          onCancel={() => setTriggerCollectionPickerOpen(false)}
        />
      )}
    </Form>
  );
};

OfferForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func
};

OfferForm.defaultProps = {
  onSubmit: () => {},
  onCancel: () => {}
};

export default OfferForm;
