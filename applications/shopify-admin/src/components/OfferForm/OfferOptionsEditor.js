import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  FormLayout,
  TextField,
  Checkbox,
  KeyboardKey
} from '@shopify/polaris';
import { asChoiceField } from '@shopify/react-form';

const OfferOptionsEditor = ({
  offer,
  enableProductLinks,
  hideOutOfStockProducts,
  enableQuantitySelection,
  productQuantityLimit,
  limitQuantitySelection,
  enableEscClose,
  enableMaskClose,
  allowMultipleUpsells,
  hideIfItemAdded,
  allowWithDiscountCodes,
  showNotificationBanner,
  submitted,
  onBlur
}) => (
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
                onBlur={() => onBlur('productQuantityLimit')}
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
);

OfferOptionsEditor.propTypes = {
  offer: PropTypes.object.isRequired,
  enableProductLinks: PropTypes.object.isRequired,
  hideOutOfStockProducts: PropTypes.object.isRequired,
  enableQuantitySelection: PropTypes.object.isRequired,
  productQuantityLimit: PropTypes.object.isRequired,
  limitQuantitySelection: PropTypes.object.isRequired,
  enableEscClose: PropTypes.object.isRequired,
  enableMaskClose: PropTypes.object.isRequired,
  allowMultipleUpsells: PropTypes.object.isRequired,
  hideIfItemAdded: PropTypes.object.isRequired,
  allowWithDiscountCodes: PropTypes.object.isRequired,
  showNotificationBanner: PropTypes.object.isRequired,
  submitted: PropTypes.bool,
  onBlur: PropTypes.func
};

OfferOptionsEditor.defaultProps = {
  submitted: false,
  onBlur: () => {}
};

export default OfferOptionsEditor;
