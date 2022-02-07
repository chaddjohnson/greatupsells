import React from 'react';
import PropTypes from 'prop-types';
import { Card, FormLayout, ChoiceList } from '@shopify/polaris';

const OfferBundlingEditor = ({ offer, enableBundling }) =>
  (offer.strategy === 'CROSS_SELL' || offer.strategy === 'THANK_YOU_PAGE') && (
    <Card title="Bundling" sectioned>
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
    </Card>
  );

OfferBundlingEditor.propTypes = {
  offer: PropTypes.object.isRequired,
  enableBundling: PropTypes.object.isRequired
};

export default OfferBundlingEditor;
