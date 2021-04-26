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

const OfferSettingsEditor = ({
  name,
  strategy,
  triggerEvent,
  discountType,
  actionButtonBehavior,
  actionButtonLink,
  actionButtonLinkOpenInNewTab,
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
              value: 'ADD',
              helpText: 'Offer is shown when a product is added to the cart.'
            },
            {
              label: 'Cart page visit',
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
            label: 'Skip the cart and redirect customers to the Checkout page',
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
                  onBlur={() => onBlur('actionButtonLink')}
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
