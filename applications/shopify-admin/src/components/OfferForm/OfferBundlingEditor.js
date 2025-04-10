import React from 'react';
import PropTypes from 'prop-types';
import { Card, FormLayout, BlockStack, Text, ChoiceList } from '@shopify/polaris';

const OfferBundlingEditor = ({ offer, theme, enableBundling }) => {
  const isCrossSellStrategy = ['CROSS_SELL', 'POST_PURCHASE', 'THANK_YOU_PAGE', 'ORDER_STATUS_PAGE'].includes(
    offer.strategy
  );

  // Hide bundling options if only one product is offered.
  if (theme.maximumOfferedProductQuantity === 1) {
    return null;
  }

  // Only show for certain strategies.
  if (!isCrossSellStrategy) {
    return null;
  }

  return (
    <Card>
      <BlockStack gap="400" padding="400">
        <Text variant="headingMd">Bundling</Text>
        <FormLayout>
          <ChoiceList
            choices={[
              {
                label: 'Offer products individually',
                helpText: 'Products may be added to the cart individually.',
                value: 'false'
              },
              {
                label: 'Offer products in a bundle',
                helpText:
                  'All presented products will added to the cart together on acceptance. Bundling helps increase average order value.',
                value: 'true'
              }
            ]}
            selected={enableBundling.value.toString()}
            onChange={([value]) => enableBundling.onChange(value === 'true')}
          />
        </FormLayout>
      </BlockStack>
    </Card>
  );
};

OfferBundlingEditor.propTypes = {
  offer: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  enableBundling: PropTypes.object.isRequired
};

export default OfferBundlingEditor;
