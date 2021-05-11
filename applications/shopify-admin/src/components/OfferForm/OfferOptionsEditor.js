import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  FormLayout,
  TextField,
  Checkbox,
  KeyboardKey
} from '@shopify/polaris';
import { asChoiceField } from '@shopify/react-form';
import styled from 'styled-components';

const DelaySecondsWrapper = styled.div`
  max-width: 175px;
`;

const OfferOptionsEditor = ({
  offer,
  delaySeconds,
  enableEscClose,
  enableMaskClose,
  showNotificationBanner,
  enableProductLinks,
  hideOutOfStockProducts,
  enableQuantitySelection,
  limitQuantitySelection,
  productQuantityLimit,
  hideIfItemAdded,
  allowWithDiscountCodes,
  submitted,
  onBlur
}) => {
  const [delayShowingPopup, setDelayShowingPopup] = useState(
    offer?.delaySeconds > 0
  );

  const handleDelayShowingPopupChange = (checked) => {
    setDelayShowingPopup(checked);

    if (!checked) {
      delaySeconds.onChange('0');
    }
  };

  return (
    <Card title="Options">
      <Card.Section title="Behavior">
        <FormLayout>
          <Checkbox
            label="Delay showing popup"
            helpText={
              delayShowingPopup && (
                <DelaySecondsWrapper>
                  <TextField
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={0.25}
                    suffix="seconds"
                    {...delaySeconds}
                    error={submitted && delaySeconds.error}
                    onBlur={() => onBlur('delaySeconds')}
                  />
                </DelaySecondsWrapper>
              )
            }
            checked={delayShowingPopup}
            onChange={handleDelayShowingPopupChange}
          />
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
          <Checkbox
            label={`Show notification bar on ${
              offer.strategy === 'UPSELL' ? 'upsell' : 'cross-sell'
            }`}
            {...asChoiceField(showNotificationBanner)}
          />
        </FormLayout>
      </Card.Section>
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
        </FormLayout>
      </Card.Section>
      <Card.Section title="Usage">
        <FormLayout>
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
    </Card>
  );
};

OfferOptionsEditor.propTypes = {
  offer: PropTypes.object.isRequired,
  enableProductLinks: PropTypes.object.isRequired,
  hideOutOfStockProducts: PropTypes.object.isRequired,
  enableQuantitySelection: PropTypes.object.isRequired,
  productQuantityLimit: PropTypes.object.isRequired,
  limitQuantitySelection: PropTypes.object.isRequired,
  delaySeconds: PropTypes.object.isRequired,
  enableEscClose: PropTypes.object.isRequired,
  enableMaskClose: PropTypes.object.isRequired,
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
