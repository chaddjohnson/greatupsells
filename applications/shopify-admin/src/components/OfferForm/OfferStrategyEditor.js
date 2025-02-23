import React from 'react';
import PropTypes from 'prop-types';
import { Card, FormLayout, ChoiceList, Banner, BlockStack, Text } from '@shopify/polaris';
import Link from '../Link';

const OfferStrategyEditor = ({ shop, strategy, onStrategyChange = () => {} }) => (
  <Card>
    <BlockStack gap="400" padding="400">
      <Text variant="headingMd">Strategy</Text>
      <FormLayout>
        <ChoiceList
          choices={[
            {
              label: 'Cross-sell',
              helpText: 'Encourage customers to purchase a related or complementary product via a popup.',
              value: 'CROSS_SELL'
            },
            {
              label: 'Upsell',
              helpText: 'Encourage customers to purchase a comparable, more expensive product via a popup.',
              value: 'UPSELL'
            },
            {
              label: 'Post-purchase offer',
              helpText: (
                <>
                  Encourage customers to purchase a related or complementary product after completing checkout, before the
                  Thank You page. Please review{' '}
                  <Link url="https://shopify.dev/apps/checkout/post-purchase#limitations-and-considerations" external>
                    limitations
                  </Link>
                  .
                </>
              ),
              value: 'POST_PURCHASE',
              renderChildren: (isSelected) =>
                isSelected &&
                !shop.onlineStore2Theme && (
                  <Banner title="Incompatible with your theme" tone="critical">
                    Your current theme does not support post-purchase features. A{' '}
                    <Link url="https://themes.shopify.com" external>
                      Shopify 2.0 theme
                    </Link>{' '}
                    is required to use this feature.
                  </Banner>
                )
            },
            {
              label: 'Thank You page offer',
              helpText:
                'Encourage customers to purchase a related or complementary product on the Thank You page after completing checkout.',
              value: 'THANK_YOU_PAGE'
            },
            {
              label: 'Order Status page offer',
              helpText: 'Encourage customers to purchase a related or complementary product on the Order Status page.',
              value: 'ORDER_STATUS_PAGE'
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
    </BlockStack>
  </Card>
);

OfferStrategyEditor.propTypes = {
  shop: PropTypes.object.isRequired,
  strategy: PropTypes.object.isRequired,
  onStrategyChange: PropTypes.func
};

export default OfferStrategyEditor;
