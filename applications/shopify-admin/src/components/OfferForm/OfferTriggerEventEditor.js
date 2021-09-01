import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  FormLayout,
  TextField,
  Checkbox,
  ChoiceList
} from '@shopify/polaris';
import { asChoiceField } from '@shopify/react-form';
import styled from 'styled-components';

const TriggerScrollThresholdWrapper = styled.div`
  .Polaris-TextField {
    max-width: 170px;
  }
`;

const OfferTriggerEventEditor = ({
  triggerEvent,
  triggerExternalLinksOnly,
  triggerScrollThreshold,
  submitted
}) => {
  const handleTriggerEventChange = (value) => {
    if (value !== 'SCROLL') {
      triggerScrollThreshold.onChange(undefined);
    }

    triggerEvent.onChange(value);
  };

  return (
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
    </Card>
  );
};

OfferTriggerEventEditor.propTypes = {
  triggerEvent: PropTypes.object.isRequired,
  triggerExternalLinksOnly: PropTypes.object.isRequired,
  triggerScrollThreshold: PropTypes.object.isRequired,
  submitted: PropTypes.bool
};

OfferTriggerEventEditor.defaultProps = {
  submitted: false
};

export default OfferTriggerEventEditor;
