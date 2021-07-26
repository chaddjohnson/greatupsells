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
  max-width: 165px;
`;

const OfferOptionsEditor = ({
  offer,
  delaySeconds,
  onPageRequiredSeconds,
  enableEscClose,
  enableMaskClose,
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
    <Card title="Options" sectioned>
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
                  error={submitted && onPageRequiredSeconds.error}
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
              Allow <KeyboardKey>esc</KeyboardKey> key to close the offer
            </>
          }
          {...asChoiceField(enableEscClose)}
        />
        <Checkbox
          label="Allow clicking outside to close the offer"
          {...asChoiceField(enableMaskClose)}
        />
        <Checkbox
          label={`Hide if customer already added ${
            offer.strategy === 'UPSELL' ? 'an upsell' : 'a cross-sell'
          } item`}
          {...asChoiceField(hideIfItemAdded)}
        />
      </FormLayout>
    </Card>
  );
};

OfferOptionsEditor.propTypes = {
  offer: PropTypes.object.isRequired,
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
