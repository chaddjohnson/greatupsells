import React from 'react';
import PropTypes from 'prop-types';
import { Card, TextField, Checkbox, ChoiceList, BlockStack, Text } from '@shopify/polaris';
import { asChoiceField } from '@shopify/react-form';

const OfferActionButtonEditor = ({
  offer,
  actionButtonBehavior,
  actionButtonLink,
  actionButtonLinkOpenInNewTab,
  performActionOnAdd,
  submitted = false
}) => {
  const isInline = ['POST_PURCHASE', 'THANK_YOU_PAGE', 'ORDER_STATUS_PAGE'].includes(offer.strategy);

  const handleActionButtonBehaviorChange = (value) => {
    actionButtonBehavior.onChange(value);

    if (value !== 'LINK') {
      actionButtonLink.onChange(undefined);
      actionButtonLinkOpenInNewTab.onChange(false);
    }
  };

  // Do not display action button actions for some types of offers.
  if (isInline) {
    return null;
  }

  return (
    <Card>
      <BlockStack gap="400" padding="400">
        <Text variant="headingMd">Action button behavior</Text>
        <ChoiceList
          choices={[
            {
              label: 'Skip the cart and redirect customers to the Checkout page',
              helpText: 'Immediately initiating checkout can increase conversions.',
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
                  <BlockStack gap="200">
                    <TextField placeholder="https://" {...actionButtonLink} error={submitted && actionButtonLink.error} />
                    <Checkbox label="Open in new browser tab" {...asChoiceField(actionButtonLinkOpenInNewTab)} />
                  </BlockStack>
                ),
              value: 'LINK'
            }
          ]}
          selected={actionButtonBehavior.value}
          onChange={([value]) => handleActionButtonBehaviorChange(value)}
        />
      </BlockStack>
      {!offer.enableBundling && ['UPSELL', 'CROSS_SELL'].includes(offer.strategy) && (
        <BlockStack>
          <Checkbox
            label="Perform this action immediately after a single offered product is accepted"
            helpText="This will prevent multiple products from being accepted."
            {...asChoiceField(performActionOnAdd)}
          />
        </BlockStack>
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

export default OfferActionButtonEditor;
