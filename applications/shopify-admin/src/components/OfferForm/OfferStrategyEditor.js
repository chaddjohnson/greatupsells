import React from 'react';
import PropTypes from 'prop-types';
import { Card, FormLayout, ChoiceList, Banner } from '@shopify/polaris';
import Link from '../Link';

const OfferStrategyEditor = ({ shop, strategy, onStrategyChange }) => (
  <>
    <Card title="Strategy" sectioned>
      <FormLayout>
        <ChoiceList
          choices={[
            {
              label: 'Cross-sell',
              helpText:
                'Encourage customers to purchase a related or complementary product via a popup.',
              value: 'CROSS_SELL'
            },
            {
              label: 'Upsell',
              helpText:
                'Encourage customers to purchase a comparable, more expensive product via a popup.',
              value: 'UPSELL'
            },
            {
              label: 'Post-purchase cross-sell',
              helpText: (
                <>
                  Encourage customers to purchase a related or complementary
                  product after completing checkout. Please review{' '}
                  <Link
                    url="https://shopify.dev/apps/checkout/post-purchase#limitations-and-considerations"
                    external
                  >
                    limitations
                  </Link>
                  .
                </>
              ),
              value: 'POST_PURCHASE',
              renderChildren: (isSelected) =>
                isSelected &&
                !shop.onlineStore2Theme && (
                  <Banner
                    title="Incompatible with your theme"
                    status="critical"
                  >
                    Your current theme does not support post-purchase features.
                    A{' '}
                    <Link url="https://themes.shopify.com" external>
                      Shopify 2.0 theme
                    </Link>{' '}
                    is required to use this feature.
                  </Banner>
                )
            },
            {
              label: 'Thank You page cross-sell',
              helpText:
                'Encourage customers to purchase a related or complementary product on the Thank You page after completing checkout.',
              value: 'THANK_YOU_PAGE'
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

OfferStrategyEditor.propTypes = {
  shop: PropTypes.object.isRequired,
  strategy: PropTypes.object.isRequired,
  onStrategyChange: PropTypes.func
};

OfferStrategyEditor.defaultProps = {
  onStrategyChange: () => {}
};

export default OfferStrategyEditor;
