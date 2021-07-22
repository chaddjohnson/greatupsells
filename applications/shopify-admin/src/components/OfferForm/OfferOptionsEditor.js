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

const SecondsInputWrapper = styled.div`
  max-width: 175px;
`;

const OfferOptionsEditor = ({
  offer,
  delaySeconds,
  onPageRequiredSeconds,
  enableEscClose,
  enableMaskClose,
  hideOutOfStockProducts,
  enableVariantSelection,
  enableQuantitySelection,
  limitQuantitySelection,
  productQuantityLimit,
  hideIfItemAdded,
  submitted
}) => {
  const [delaySecondsActive, setDelaySecondsActive] = useState(
    offer?.delaySeconds > 0
  );
  const [
    onPageRequiredSecondsActive,
    setOnPageRequiredSecondsActive
  ] = useState(offer?.onPageRequiredSeconds > 0);

  const handleDelaySecondsActiveChange = (checked) => {
    setDelaySecondsActive(checked);

    if (!checked) {
      delaySeconds.onChange('0');
    }
  };

  const handleOnPageRequiredSecondsActiveChange = (checked) => {
    setOnPageRequiredSecondsActive(checked);

    if (!checked) {
      onPageRequiredSeconds.onChange('0');
    }
  };

  return (
    <Card title="Options">
      <Card.Section title="Behavior">
        <FormLayout>
          <Checkbox
            label="Delay showing offer after trigger event"
            helpText={
              delaySecondsActive && (
                <SecondsInputWrapper>
                  <TextField
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={0.25}
                    suffix="seconds"
                    {...delaySeconds}
                    error={submitted && delaySeconds.error}
                  />
                </SecondsInputWrapper>
              )
            }
            checked={delaySecondsActive}
            onChange={handleDelaySecondsActiveChange}
          />
          <Checkbox
            label="Require customer be on page for a specified amount of time before allowing offer to show"
            helpText={
              onPageRequiredSecondsActive && (
                <SecondsInputWrapper>
                  <TextField
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1}
                    suffix="seconds"
                    {...onPageRequiredSeconds}
                    error={submitted && delaySeconds.error}
                  />
                </SecondsInputWrapper>
              )
            }
            checked={onPageRequiredSecondsActive}
            onChange={handleOnPageRequiredSecondsActiveChange}
          />
          <Checkbox
            label={
              <>
                Allow <KeyboardKey>esc</KeyboardKey> key to close offer
              </>
            }
            {...asChoiceField(enableEscClose)}
          />
          <Checkbox
            label="Allow clicking outside to close offer"
            {...asChoiceField(enableMaskClose)}
          />
        </FormLayout>
      </Card.Section>
      <Card.Section title="Products">
        <FormLayout>
          <Checkbox
            label="Exclude out of stock products"
            {...asChoiceField(hideOutOfStockProducts)}
          />
          <Checkbox
            label="Allow customers to select variants (if supported by theme, and when variants are available)"
            helptext={!enableVariantSelection.value}
            {...asChoiceField(enableVariantSelection)}
          />
          <Checkbox
            label="Allow customers to change quantities (if supported by theme)"
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
                  helpText="Product quantity will be limited each time this offer is shown and not for the whole cart."
                  {...productQuantityLimit}
                  error={
                    submitted &&
                    offer.limitQuantitySelection &&
                    productQuantityLimit.error
                  }
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
        </FormLayout>
      </Card.Section>
    </Card>
  );
};

OfferOptionsEditor.propTypes = {
  offer: PropTypes.object.isRequired,
  hideOutOfStockProducts: PropTypes.object.isRequired,
  enableVariantSelection: PropTypes.object.isRequired,
  enableQuantitySelection: PropTypes.object.isRequired,
  productQuantityLimit: PropTypes.object.isRequired,
  limitQuantitySelection: PropTypes.object.isRequired,
  delaySeconds: PropTypes.object.isRequired,
  onPageRequiredSeconds: PropTypes.object.isRequired,
  enableEscClose: PropTypes.object.isRequired,
  enableMaskClose: PropTypes.object.isRequired,
  hideIfItemAdded: PropTypes.object.isRequired,
  submitted: PropTypes.bool
};

OfferOptionsEditor.defaultProps = {
  submitted: false
};

export default OfferOptionsEditor;
