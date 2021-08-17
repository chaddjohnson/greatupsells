import React from 'react';
import PropTypes from 'prop-types';
import { Card, FormLayout, ChoiceList } from '@shopify/polaris';

const OfferBasicsEditor = ({ strategy, onStrategyChange }) => (
  <>
    <Card title="Strategy" sectioned>
      <FormLayout>
        <ChoiceList
          choices={[
            {
              label: 'Cross-sell',
              helpText:
                'Encourage customers to purchase a related or complementary product.',
              value: 'CROSS_SELL'
            },
            {
              label: 'Upsell',
              helpText:
                'Encourage customers to purchase a comparable, more expensive product.',
              value: 'UPSELL'
            }
            // {
            //   label: 'Popup',
            //   helpText:
            //     'Display a popup for email collection, newsletter signups, surveys, sales, promotions, and general information.',
            //   value: 'POPUP'
            // }
          ]}
          selected={strategy.value}
          onChange={([value]) => onStrategyChange(value)}
        />
      </FormLayout>
    </Card>
  </>
);

OfferBasicsEditor.propTypes = {
  strategy: PropTypes.object.isRequired,
  onStrategyChange: PropTypes.func
};

OfferBasicsEditor.defaultProps = {
  onStrategyChange: () => {}
};

export default OfferBasicsEditor;
