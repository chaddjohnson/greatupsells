import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  FormLayout,
  TextField,
  Checkbox,
  ChoiceList,
  Popover,
  Button,
  Heading,
  TextContainer,
  Icon,
  Banner,
  Stack
} from '@shopify/polaris';
import { SearchMinor } from '@shopify/polaris-icons';
import { ResourcePicker } from '@shopify/app-bridge-react';
import { asChoiceField } from '@shopify/react-form';
import styled from 'styled-components';
import { useNumberFormatter } from '@neatowebsolutions/upselling-react-hooks';
import ProductResourceList from './ProductResourceList';
import Link from '../Link';

const DiscountValueInputWrapper = styled.div`
  .Polaris-TextField {
    max-width: 170px;
  }
`;

const TriggerScrollThresholdWrapper = styled.div`
  max-width: 110px;
`;

const ViewAllowanceDaysInputWrapper = styled.div`
  max-width: 125px;
`;

const OfferSettingsEditor = ({
  shop,
  offer,
  name,
  strategy,
  triggerEvent,
  triggerExternalLinksOnly,
  triggerScrollThreshold,
  triggerPage,
  triggerPagePath,
  triggerProducts,
  triggerCollections,
  discountType,
  discountValue,
  discountTitle,
  actionButtonBehavior,
  actionButtonLink,
  actionButtonLinkOpenInNewTab,
  viewAllowance,
  viewAllowanceDays,
  submitted,
  onStrategyChange
}) => {
  const [triggerProductPickerOpen, setTriggerProductPickerOpen] = useState(
    false
  );
  const [
    triggerCollectionPickerOpen,
    setTriggerCollectionPickerOpen
  ] = useState(false);
  const [
    triggerPagePathPopoverActive,
    setTriggerPagePathPopoverActive
  ] = useState(false);
  const [discountValueInternal, setDiscountValueInternal] = useState(
    discountType.value === 'PERCENTAGE' && discountValue.value
      ? discountValue.value * 100
      : discountValue.value
  );

  const { locale, countryCode, currency } = shop || {};
  const { getCurrencySymbol } = useNumberFormatter({
    locale,
    countryCode,
    currency
  });
  const currencySymbol = getCurrencySymbol();

  const handleActionButtonBehaviorChange = (value) => {
    actionButtonBehavior.onChange(value);

    if (value !== 'LINK') {
      actionButtonLink.onChange(undefined);
      actionButtonLinkOpenInNewTab.onChange(false);
    }
  };

  const handleTriggerEventChange = (value) => {
    if (value !== 'SCROLL') {
      triggerScrollThreshold.onChange(undefined);
    }

    triggerEvent.onChange(value);
  };

  const handleViewAllowanceChange = (value) => {
    if (value === 'DAYS') {
      viewAllowanceDays.onChange('7');
    } else {
      viewAllowanceDays.onChange(undefined);
    }

    viewAllowance.onChange(value);
  };

  const handleDiscountTypeChange = (value) => {
    if (discountType.value === 'NO_DISCOUNT') {
      discountValue.onChange(undefined);
      discountTitle.onChange(undefined);
    }

    discountType.onChange(value);

    setDiscountValueInternal(undefined);
    discountValue.onChange(undefined);
  };

  const handleDiscountValueChange = (value) => {
    setDiscountValueInternal(value);

    discountValue.onChange(
      discountType.value === 'PERCENTAGE' && value ? value * 100 : value
    );
  };

  const handleDiscountValueBlur = () => {
    if (discountValueInternal) {
      setDiscountValueInternal(parseFloat(discountValueInternal)?.toFixed(2));
    }

    discountValue.onBlur();
  };

  const handleTriggerPageChange = (value) => {
    if (triggerPage.value !== 'PAGE') {
      triggerPagePath.onChange(undefined);
    }

    triggerPage.onChange(value);
  };

  const handleTriggerPagePathBlur = (event) => {
    const hasLeadingSlash = !!triggerPagePath.value?.match(/^\//);

    if (triggerPagePath.value && !hasLeadingSlash) {
      triggerPagePath.onChange(`/${triggerPagePath.value}`);
    }

    triggerPagePath.onBlur(event);
  };

  return (
    <>
      <Card title="Offer name" sectioned>
        <FormLayout>
          <TextField
            placeholder="Buy one get one 10% off"
            helpText="Internal name for your reference."
            {...name}
            error={submitted && name.error}
          />
        </FormLayout>
      </Card>
      <Card title="Strategy" sectioned>
        <FormLayout>
          <ChoiceList
            choices={[
              {
                label: 'Cross-sell',
                helpText:
                  'Encourage customers to purchase a related or complementary product.',
                value: 'CROSS_SELL'
              },
              {
                label: 'Upsell',
                helpText:
                  'Encourage customers to purchase a comparable, more expensive product.',
                value: 'UPSELL'
              }
              // {
              //   label: 'Popup',
              //   helpText:
              //     'Display a popup for email collection, newsletter signups, surveys, sales, promotions, and general information.',
              //   value: 'POPUP'
              // }
            ]}
            selected={strategy.value}
            onChange={([value]) => onStrategyChange(value)}
          />
        </FormLayout>
      </Card>
      <Card title="Triggers">
        <Card.Section title="Event">
          <FormLayout>
            <ChoiceList
              choices={[
                {
                  label: 'Add to cart',
                  helpText:
                    'Offer is shown when a product is added to the cart.',
                  value: 'ADD'
                },
                {
                  label: 'Page load',
                  helpText: 'Offer is shown when the page loads.',
                  value: 'LOAD'
                },
                {
                  label: 'Exit intent',
                  helpText:
                    'Offer is shown on desktop when the mouse is moved above the browser window and on mobile with fast scroll up.',
                  value: 'EXIT'
                },
                {
                  label: 'Lost browser focus',
                  helpText:
                    'Offer is shown when the browser tab fully loses visibility or another browser tab is selected.',
                  value: 'FOCUS'
                },
                {
                  label: 'Page scroll',
                  helpText:
                    'Offer is shown when the page is scrolled downward beyond a specified threshold.',
                  value: 'SCROLL',
                  renderChildren: (isSelected) =>
                    isSelected && (
                      <TriggerScrollThresholdWrapper>
                        <TextField
                          inputMode="numeric"
                          suffix="%"
                          {...triggerScrollThreshold}
                          error={submitted && triggerScrollThreshold.error}
                        />
                      </TriggerScrollThresholdWrapper>
                    )
                },
                {
                  label: 'Link click',
                  helpText:
                    'Offer is shown when any link is clicked. Links are followed when the popup is closed.',
                  value: 'LINK',
                  renderChildren: (isSelected) =>
                    isSelected && (
                      <Checkbox
                        label="Limit to external links"
                        {...asChoiceField(triggerExternalLinksOnly)}
                      />
                    )
                }
              ]}
              selected={triggerEvent.value}
              onChange={([value]) => handleTriggerEventChange(value)}
            />
          </FormLayout>
        </Card.Section>
        <Card.Section title="Pages">
          <FormLayout>
            <ChoiceList
              choices={[
                {
                  label: 'Any page',
                  helpText: 'Offer may show on any page.',
                  value: 'ANY'
                },
                {
                  label: 'Specific pages',
                  helpText:
                    'Offer may show only on one or more specific pages.',
                  renderChildren: (isSelected) =>
                    isSelected && (
                      <TextField
                        value={triggerPagePath.value}
                        placeholder="/page-url/here"
                        helpText={
                          <>
                            <Popover
                              sectioned
                              active={triggerPagePathPopoverActive}
                              activator={
                                <>
                                  Use{' '}
                                  <Button
                                    plain
                                    monochrome
                                    onClick={() =>
                                      setTriggerPagePathPopoverActive(
                                        !triggerPagePathPopoverActive
                                      )
                                    }
                                  >
                                    glob syntax
                                  </Button>{' '}
                                  to reference multiple pages.
                                </>
                              }
                              onClose={() =>
                                setTriggerPagePathPopoverActive(false)
                              }
                            >
                              <TextContainer spacing="loose">
                                <Heading>Glob syntax</Heading>
                                <p>The path</p>
                                <p>
                                  <code>*/products/*</code>
                                </p>
                                <p>will match all product page URLs such as</p>
                                <p>
                                  <code>/products/fancy-shoes</code>
                                  <br />
                                  <code>/products/silly-socks</code>
                                  <br />
                                  <code>
                                    /collections/shoes/products/fancy-shoes
                                  </code>
                                  <br />
                                  <code>
                                    /collections/shoes/products/silly-socks
                                  </code>
                                </p>
                                <p>
                                  <Link
                                    url="https://en.wikipedia.org/wiki/Glob_(programming)"
                                    external
                                  >
                                    More information
                                  </Link>
                                </p>
                                <p>
                                  Please note that extended glob support is
                                  enabled, and globstar support is disabled.
                                </p>
                              </TextContainer>
                            </Popover>
                          </>
                        }
                        {...triggerPagePath}
                        error={submitted && triggerPagePath.error}
                        onBlur={handleTriggerPagePathBlur}
                      />
                    ),
                  value: 'PAGE'
                }
              ]}
              selected={triggerPage.value}
              onChange={([value]) => handleTriggerPageChange(value)}
            />
          </FormLayout>
        </Card.Section>
        <>
          <Card.Section title="Products and collections">
            <FormLayout>
              {offer.triggerEvent === 'ADD' &&
                !offer.triggerProducts?.length &&
                !offer.triggerCollections?.length && (
                  <Banner status="info">
                    Offer will show when <em>any</em> product is added to the
                    cart. Select triggers below to only show the offer when
                    specific products or products in collections are added.
                  </Banner>
                )}
              {offer.triggerEvent !== 'ADD' &&
                !offer.triggerProducts?.length &&
                !offer.triggerCollections?.length && (
                  <Banner status="info">
                    Offer will show regardless of products in the cart. Select
                    triggers below to only show the offer when specific products
                    or products in collections have been added to the cart.
                  </Banner>
                )}
              {(!!offer.triggerProducts?.length ||
                !!offer.triggerCollections?.length) && (
                <Banner status="info">
                  Offer will show only when a product or product in a collection
                  below has been added to the cart.
                </Banner>
              )}
              <TextField
                label="Trigger products"
                helpText="The popup will show when any selected products have been added to the cart."
                placeholder="Search products"
                prefix={<Icon source={SearchMinor} />}
                connectedRight={
                  <Button onClick={() => setTriggerProductPickerOpen(true)}>
                    Browse
                  </Button>
                }
                onChange={() => setTriggerProductPickerOpen(true)}
              />
              <ProductResourceList
                items={triggerProducts}
                // onChange={triggerProducts.onChange}
                // onRemoveItem={triggerProducts => setOffer({ ...offer, triggerProducts })}
              />
              <TextField
                label="Trigger collections"
                helpText="The popup will show when any products from selected collections have been added to the cart."
                placeholder="Search collections"
                prefix={<Icon source={SearchMinor} />}
                connectedRight={
                  <Button onClick={() => setTriggerCollectionPickerOpen(true)}>
                    Browse
                  </Button>
                }
                onChange={() => setTriggerCollectionPickerOpen(true)}
              />
              <ProductResourceList
                items={triggerCollections}
                // onChange={triggerCollections.onChange}
                // onRemoveItem={triggerCollections => setOffer({ ...offer, triggerCollections })}
              />
            </FormLayout>
          </Card.Section>
          {triggerProductPickerOpen && (
            <ResourcePicker
              resourceType="Product"
              showVariants={false}
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
        </>
      </Card>
      <Card title="View frequency allowance" sectioned>
        <ChoiceList
          choices={[
            {
              label: 'Once within a period of days',
              helpText:
                'Customers may only see this offer once within a period of days.',
              renderChildren: (isSelected) =>
                isSelected && (
                  <ViewAllowanceDaysInputWrapper>
                    <TextField
                      inputMode="numeric"
                      suffix="days"
                      {...viewAllowanceDays}
                      error={submitted && viewAllowanceDays.error}
                    />
                  </ViewAllowanceDaysInputWrapper>
                ),
              value: 'DAYS'
            },
            {
              label: 'Once per browser tab session',
              helpText:
                'Customers may see this offer only once per browser tab session.',
              value: 'SESSION'
            },
            {
              label: 'One time',
              helpText: 'Customers may see this offer only one time.',
              value: 'ONCE'
            },
            {
              label: 'Once every page load',
              helpText:
                'Customers may see this offer with every new page visited.',
              value: 'PAGE'
            }
          ]}
          selected={viewAllowance.value}
          onChange={([value]) => handleViewAllowanceChange(value)}
        />
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
                'Skip the cart and redirect customers to the Checkout page',
              helpText:
                'Immediately initiating checkout can increase conversions.',
              value: 'CHECKOUT'
            },
            {
              label: 'Remain on the same page',
              value: 'PAGE'
            },
            {
              label: 'Open a link',
              renderChildren: (isSelected) =>
                isSelected && (
                  <Stack vertical spacing="tight">
                    <TextField
                      placeholder="https://"
                      {...actionButtonLink}
                      error={submitted && actionButtonLink.error}
                    />
                    <Checkbox
                      label="Open in new browser tab"
                      {...asChoiceField(actionButtonLinkOpenInNewTab)}
                    />
                  </Stack>
                ),
              value: 'LINK'
            }
          ]}
          selected={actionButtonBehavior.value}
          onChange={([value]) => handleActionButtonBehaviorChange(value)}
        />
      </Card>
      {offer.strategy !== 'POPUP' && (
        <Card title="Discount" sectioned>
          <FormLayout>
            <ChoiceList
              choices={[
                {
                  label: 'Percentage off',
                  value: 'PERCENTAGE'
                },
                {
                  label: `${currency} off`,
                  value: 'AMOUNT'
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
              onChange={([value]) => handleDiscountTypeChange(value)}
            />
            {discountType.value !== 'NO_DISCOUNT' && (
              <DiscountValueInputWrapper>
                <TextField
                  label="Discount value"
                  prefix={
                    (discountType.value === 'AMOUNT' && currencySymbol) ||
                    (discountType.value === 'SET_PRICE' && currencySymbol)
                  }
                  suffix={discountType.value === 'PERCENTAGE' && '%'}
                  placeholder={
                    (discountType.value === 'AMOUNT' && '0.00') ||
                    (discountType.value === 'SET_PRICE' && '0.00') ||
                    undefined
                  }
                  helpText="The discount amount applied to the offered items added to the cart."
                  inputMode="numeric"
                  {...discountValue}
                  value={discountValueInternal?.toString()}
                  error={submitted && discountValue.error}
                  onChange={handleDiscountValueChange}
                  onBlur={handleDiscountValueBlur}
                />
              </DiscountValueInputWrapper>
            )}
            {discountType.value !== 'NO_DISCOUNT' && (
              <TextField
                label="Discount description"
                placeholder={
                  (discountType.value === 'PERCENTAGE' && '10% off') ||
                  (discountType.value === 'AMOUNT' && '$10 off') ||
                  (discountType.value === 'SET_PRICE' && 'Discounted price') ||
                  undefined
                }
                helpText="This will show as a discount description for order line items."
                {...discountTitle}
                error={submitted && discountTitle.error}
              />
            )}
          </FormLayout>
        </Card>
      )}
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
    </>
  );
};

OfferSettingsEditor.propTypes = {
  shop: PropTypes.object.isRequired,
  offer: PropTypes.object.isRequired,
  name: PropTypes.object.isRequired,
  strategy: PropTypes.object.isRequired,
  triggerEvent: PropTypes.object.isRequired,
  triggerExternalLinksOnly: PropTypes.object.isRequired,
  triggerScrollThreshold: PropTypes.object.isRequired,
  triggerPage: PropTypes.object.isRequired,
  triggerPagePath: PropTypes.object.isRequired,
  triggerProducts: PropTypes.arrayOf(PropTypes.object).isRequired,
  triggerCollections: PropTypes.arrayOf(PropTypes.object).isRequired,
  discountType: PropTypes.object.isRequired,
  discountValue: PropTypes.object.isRequired,
  discountTitle: PropTypes.object.isRequired,
  actionButtonBehavior: PropTypes.object.isRequired,
  actionButtonLink: PropTypes.object.isRequired,
  actionButtonLinkOpenInNewTab: PropTypes.object.isRequired,
  viewAllowance: PropTypes.object.isRequired,
  viewAllowanceDays: PropTypes.object.isRequired,
  submitted: PropTypes.bool,
  onStrategyChange: PropTypes.func
};

OfferSettingsEditor.defaultProps = {
  submitted: false,
  onStrategyChange: () => {}
};

export default OfferSettingsEditor;
