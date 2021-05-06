import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  FormLayout,
  TextField,
  Checkbox,
  ChoiceList,
  Stack
} from '@shopify/polaris';
import { asChoiceField } from '@shopify/react-form';
import styled from 'styled-components';

const ViewAllowanceDaysInputWrapper = styled.div`
  max-width: 125px;
`;

const OfferSettingsEditor = ({
  name,
  strategy,
  triggerEvent,
  discountType,
  actionButtonBehavior,
  actionButtonLink,
  actionButtonLinkOpenInNewTab,
  viewAllowance,
  viewAllowanceDays,
  currency,
  submitted,
  onStrategyChange,
  onBlur
}) => (
  <>
    <Card title="Offer name" sectioned>
      <FormLayout>
        <TextField
          placeholder="Buy one get one 10% off"
          helpText="Internal name for your reference."
          {...name}
          error={submitted && name.error}
          onBlur={() => onBlur('name')}
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
            },
            {
              label: 'Popup',
              helpText:
                'Display a popup for email collection, newsletter signups, surveys, sales, promotions, and general information.',
              value: 'POPUP'
            }
          ]}
          selected={strategy.value}
          onChange={([value]) => onStrategyChange(value)}
        />
      </FormLayout>
    </Card>
    <Card title="Trigger event" sectioned>
      <FormLayout>
        <ChoiceList
          choices={[
            {
              label: 'Add to cart',
              helpText: 'Offer is shown when a product is added to the cart.',
              value: 'ADD'
            },
            {
              label: 'Cart page visit',
              helpText: 'Offer is shown on the Cart page before checkout.',
              value: 'CART'
            },
            {
              label: 'Shop visit',
              helpText: 'Offer is shown when your shop is first visted.',
              value: 'LOAD'
            },
            {
              label: 'Exit intent',
              helpText:
                'Offer is shown on desktop when the mouse is moved above the browser window after three seconds of page load and on mobile with fast scroll up.',
              value: 'EXIT'
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
            label: 'Skip the cart and redirect customers to the Checkout page',
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
            helpText: actionButtonBehavior.value === 'LINK' && (
              <Stack vertical spacing="tight">
                <TextField
                  placeholder="https://"
                  {...actionButtonLink}
                  error={submitted && actionButtonLink.error}
                  onBlur={() => onBlur('actionButtonLink')}
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
        onChange={([value]) => actionButtonBehavior.onChange(value)}
      />
    </Card>
    <Card title="View allowance" sectioned>
      <ChoiceList
        choices={[
          {
            label: 'Once within a period of days',
            helpText: (
              <Stack vertical spacing="tight">
                <span>
                  Customers may only see this offer once within a period of
                  days.
                </span>
                {viewAllowance.value === 'DAYS' && (
                  <ViewAllowanceDaysInputWrapper>
                    <TextField
                      type="number"
                      inputMode="numeric"
                      min={1}
                      step={1}
                      suffix="days"
                      {...viewAllowanceDays}
                      error={submitted && viewAllowanceDays.error}
                      onBlur={() => onBlur('viewAllowanceDays')}
                    />
                  </ViewAllowanceDaysInputWrapper>
                )}
              </Stack>
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
        onChange={([value]) => viewAllowance.onChange(value)}
      />
    </Card>
  </>
);

OfferSettingsEditor.propTypes = {
  name: PropTypes.object.isRequired,
  strategy: PropTypes.object.isRequired,
  triggerEvent: PropTypes.object.isRequired,
  discountType: PropTypes.object.isRequired,
  actionButtonBehavior: PropTypes.object.isRequired,
  actionButtonLink: PropTypes.object.isRequired,
  actionButtonLinkOpenInNewTab: PropTypes.object.isRequired,
  viewAllowance: PropTypes.object.isRequired,
  viewAllowanceDays: PropTypes.object.isRequired,
  currency: PropTypes.string.isRequired,
  submitted: PropTypes.bool,
  onStrategyChange: PropTypes.func,
  onBlur: PropTypes.func
};

OfferSettingsEditor.defaultProps = {
  submitted: false,
  onStrategyChange: () => {},
  onBlur: () => {}
};

export default OfferSettingsEditor;
