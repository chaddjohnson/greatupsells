import React, { useContext, useState, useEffect, useMemo } from 'react';
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
  Stack,
  KeyboardKey
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
import { usePopupThemes } from '../../hooks';
import ManagedResourceList from './ManagedResourceList';
import DateTimePicker from '../DateTimePicker';
import CountryAutocomplete from './CountryAutocomplete';
import OfferSummary from './OfferSummary';
import ThemeEditor from './ThemeEditor';

const { OfferPopup } =
  (typeof window !== 'undefined' &&
    require('@neatowebsolutions/upselling-react-components')) ||
  {};

const timezone = moment.tz.guess();
const timezoneAbbreviation = moment.tz(timezone).format('z');

const product = {
  title: 'Example Product',
  price: 14.99,
  salePrice: 12.99,
  url: '/products/example-product'
  // ...
};

const OfferPopupContainer = styled.div`
  > div {
    position: static;
  }

  min-height: 360px;
`;

const OfferForm = ({ initialValues, currency, onSubmit, onCancel }) => {
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
  const [offerPopupContainer, setOfferPopupContainer] = useState(null);
  const [previewActive, setPreviewActive] = useState(false);

  const { popupThemes } = usePopupThemes();

  let contextualSaveBar = null;

  const name = useField({
    value: initialValues.name,
    validates: [notEmpty("Name can't be blank")]
  });
  const strategy = useField(initialValues.strategy);
  const triggerEvent = useField(initialValues.triggerEvent);
  const discountType = useField(initialValues.discountType);
  const offeredProducts = useList(initialValues.offeredProducts);
  const offeredCollections = useList(initialValues.offeredCollections);
  const triggerProducts = useList(initialValues.triggerProducts);
  const triggerCollections = useList(initialValues.triggerCollections);
  const enableGeotargeting = useField(initialValues.enableGeotargeting);
  const geotargetingCountries = useField(initialValues.geotargetingCountries);
  const actionButtonBehavior = useField(initialValues.actionButtonBehavior);
  const actionButtonLink = useField(
    {
      value: '',
      validates: (value) => {
        if (actionButtonBehavior.value === 'Link' && !value) {
          return "Action button link can't be blank";
        }
      }
    },
    [actionButtonBehavior.value]
  );
  const actionButtonLinkOpenInNewTab = useField(
    initialValues.actionButtonLinkOpenInNewTab || false
  );
  const showNotificationBanner = useField(initialValues.showNotificationBanner);
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
  const enableEscClose = useField(initialValues.enableEscClose);
  const enableMaskClose = useField(initialValues.enableMaskClose);
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

  const { fields, dirty, submit, submitting /* submitErrors */ } = useForm({
    fields: {
      name,
      strategy,
      triggerEvent,
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
      showNotificationBanner,
      successMessageText,
      popupTheme,
      startAt,
      endAt,
      enableTimer,
      enableProductLinks,
      hideOutOfStockProducts,
      enableEscClose,
      enableMaskClose,
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
  const handleBlur = (fieldName) => (event) => {
    const field = fields[fieldName];

    if (event && event.target && field) {
      setTimeout(() => field.onBlur(event), 0);
    }
  };

  const handleEnableGeotargeting = (value) => {
    enableGeotargeting.onChange(value);

    if (!value) {
      geotargetingCountries.onChange([]);
    }
  };

  const handleStartAtChange = (value) => {
    startAt.onChange(value);

    if (
      showEndDate &&
      offer.endAt &&
      value &&
      new Date(offer.endAt) < new Date(value)
    ) {
      endAt.onChange(value);
    }
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
                      'Encourage customers to purchase a comparable, more expensive product.'
                  },
                  {
                    label: 'Cross-sell',
                    value: 'CROSS_SELL',
                    helpText:
                      'Encourage customers to purchase a related or complementary product.'
                  },
                  {
                    label: 'Popup',
                    value: 'POPUP',
                    helpText:
                      'Display a popup for email collection, newsletter signups, surveys, sales, promotions, and general information.'
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
                    label: 'Shop visit',
                    value: 'LOAD',
                    helpText: 'Offer is shown when your shop is first visted.'
                  },
                  {
                    label: 'Exit intent',
                    value: 'EXIT',
                    helpText:
                      'Offer is shown on desktop when the mouse is moved above the browser window after three seconds of page load and on mobile with fast scroll up.'
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
                    label: `${currency} off`,
                    value: currency
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
          <Card title="Minimum requirements" sectioned>
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
                },
                {
                  label: 'Open a link',
                  value: 'LINK',
                  helpText: actionButtonBehavior.value === 'LINK' && (
                    <Stack vertical spacing="tight">
                      <TextField
                        placeholder="https://"
                        {...actionButtonLink}
                        error={submitted && actionButtonLink.error}
                        onBlur={handleBlur('actionButtonLink')}
                      />
                      <Checkbox
                        label="Open in new browser tab"
                        {...asChoiceField(actionButtonLinkOpenInNewTab)}
                      />
                    </Stack>
                  )
                }
              ]}
              selected={actionButtonBehavior.value}
              onChange={([value]) => actionButtonBehavior.onChange(value)}
            />
          </Card>
          <Card
            title={`Products and collections to ${
              offer.strategy === 'UPSELL' ? 'upsell' : 'cross-sell'
            }`}
          >
            <Card.Section title="Products">
              <TextField
                helpText={`Selected products will be shown at random and offered as ${
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
                items={offer.offeredProducts}
                // onChange={}
                // onRemoveItem={offeredProducts => setOffer({ ...offer, offeredProducts })}
              />
            </Card.Section>
            <Card.Section title="Collections">
              <TextField
                helpText={`Products from selected collections will be shown at random and offered as ${
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
                items={offer.offeredCollections}
                // onChange={}
                // onRemoveItem={offeredCollections => setOffer({ ...offer, offeredCollections })}
              />
            </Card.Section>
          </Card>
          {['ADD', 'CART'].indexOf(triggerEvent.value) > -1 && (
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
                  // onRemoveItem={triggerProducts => setOffer({ ...offer, triggerProducts })}
                />
              </Card.Section>
              <Card.Section title="Collections">
                <TextField
                  helpText="The popup will show when products from selected collections are in the cart."
                  placeholder="Search collections"
                  prefix={<Icon source={SearchMinor} />}
                  connectedRight={
                    <Button
                      onClick={() => setTriggerCollectionPickerOpen(true)}
                    >
                      Browse
                    </Button>
                  }
                  onChange={() => setTriggerCollectionPickerOpen(true)}
                />
                <ManagedResourceList
                  items={offer.triggerCollections}
                  // onChange={triggerCollections.onChange}
                  // onRemoveItem={triggerCollections => setOffer({ ...offer, triggerCollections })}
                />
              </Card.Section>
            </Card>
          )}
          <ThemeEditor
            type={offer.strategy}
            theme={offer.popupTheme}
            themes={popupThemes}
            previewElement={
              <>
                <OfferPopupContainer
                  ref={(ref) => setOfferPopupContainer(ref)}
                />
                {offerPopupContainer && (
                  <OfferPopup
                    appRoot="#__next"
                    renderTo={!previewActive && offerPopupContainer}
                    open={true}
                    previewMode={true}
                    offer={offer}
                    product={product}
                    onClose={() => setPreviewActive(false)}
                    onClick={() => setPreviewActive(true)}
                  />
                )}
              </>
            }
            onChange={(value) => popupTheme.onChange(value)}
          />
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
          <Card title="Geotargeting" sectioned>
            <Stack vertical>
              <Checkbox
                label="Restrict offer to specific countries"
                {...asChoiceField(enableGeotargeting)}
                onChange={handleEnableGeotargeting}
              />
              {enableGeotargeting.value && (
                <CountryAutocomplete
                  label="Countries"
                  placeholder="Search"
                  selected={geotargetingCountries.value}
                  onChange={geotargetingCountries.onChange}
                  error={submitted && geotargetingCountries.error}
                  onBlur={handleBlur('geotargetingCountries')}
                />
              )}
            </Stack>
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
                <Checkbox label="Delay showing popup" />
                <Checkbox
                  label={
                    <>
                      Allow <KeyboardKey>esc</KeyboardKey> key to close popup
                    </>
                  }
                  {...asChoiceField(enableEscClose)}
                />
                <Checkbox
                  label="Allow clicking outside to close popup"
                  {...asChoiceField(enableMaskClose)}
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
        </Layout.Section>
        <Layout.Section secondary>
          <Card title="Summary" subdued>
            <OfferSummary offer={offer} />
          </Card>
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
  initialValues: PropTypes.object,
  currency: PropTypes.string,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func
};

OfferForm.defaultProps = {
  initialValues: {},
  currency: 'USD',
  onSubmit: () => {},
  onCancel: () => {}
};

export default OfferForm;
