import React from 'react';
import PropTypes from 'prop-types';
import { Card, FormLayout, ChoiceList } from '@shopify/polaris';

const OfferBundlingEditor = ({ offer, enableBundling }) =>
  offer.strategy === 'CROSS_SELL' && (
    <Card title="Bundling" sectioned>
      <FormLayout>
        <ChoiceList
          choices={[
            {
              label: 'Offer products individually',
              helpText:
                'Products will not be bundled and may be added to the cart individually.',
              value: 'false'
            },
            {
              label: 'Offer products in a bundle',
              helpText:
                'All products presented in the offer will be bundled and added to the cart together on acceptance. Bundling helps increase average order value.',
              value: 'true'
            }
          ]}
          selected={enableBundling.value.toString()}
          onChange={([value]) => enableBundling.onChange(value === 'true')}
        />
      </FormLayout>
    </Card>
  );

OfferBundlingEditor.propTypes = {
  offer: PropTypes.object.isRequired,
  enableBundling: PropTypes.object.isRequired
};

export default OfferBundlingEditor;
