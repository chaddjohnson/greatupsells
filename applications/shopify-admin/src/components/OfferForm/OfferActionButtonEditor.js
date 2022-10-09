import React from 'react';
import PropTypes from 'prop-types';
import { Card, TextField, Checkbox, ChoiceList, Stack } from '@shopify/polaris';
import { asChoiceField } from '@shopify/react-form';

const OfferActionButtonEditor = ({
  offer,
  actionButtonBehavior,
  actionButtonLink,
  actionButtonLinkOpenInNewTab,
  performActionOnAdd,
  submitted
}) => {
  const handleActionButtonBehaviorChange = (value) => {
    actionButtonBehavior.onChange(value);

    if (value !== 'LINK') {
      actionButtonLink.onChange(undefined);
      actionButtonLinkOpenInNewTab.onChange(false);
    }
  };

  // Do not display action button actions for Post Purchase or Thank You Page offers.
  if (
    offer.strategy === 'POST_PURCHASE' ||
    offer.strategy === 'THANK_YOU_PAGE'
  ) {
    return null;
  }

  return (
    <Card title="Action button behavior">
      <Card.Section>
        <ChoiceList
          choices={[
            {
              label:
                'Skip the cart and redirect customers to the Checkout page',
              helpText:
                'Immediately initiating checkout can increase conversions.',
              value: 'CHECKOUT'
            },
            {
              label: 'Redirect customers to the Cart page',
              value: 'CART'
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
      </Card.Section>
      {['UPSELL', 'CROSS_SELL'].includes(offer.strategy) && (
        <Card.Section>
          <Checkbox
            label="Perform this action immediately after an offered product is accepted"
            {...asChoiceField(performActionOnAdd)}
          />
        </Card.Section>
      )}
    </Card>
  );
};

OfferActionButtonEditor.propTypes = {
  offer: PropTypes.object.isRequired,
  actionButtonBehavior: PropTypes.object.isRequired,
  actionButtonLink: PropTypes.object.isRequired,
  actionButtonLinkOpenInNewTab: PropTypes.object.isRequired,
  performActionOnAdd: PropTypes.object.isRequired,
  submitted: PropTypes.bool
};

OfferActionButtonEditor.defaultProps = {
  submitted: false
};

export default OfferActionButtonEditor;
