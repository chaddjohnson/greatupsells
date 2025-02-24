import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Card, Text, List, BlockStack, InlineStack } from '@shopify/polaris';
import { useNumberFormatter, useCurrency, useDateTime } from '@greatupsells/react-hooks';
import { useShop } from '../../hooks';
import OfferStatus from '../OfferStatus';

const strategyMap = {
  CROSS_SELL: 'Cross-sell',
  UPSELL: 'Upsell',
  POST_PURCHASE: 'Post-purchase',
  THANK_YOU_PAGE: 'Thank You page',
  ORDER_STATUS_PAGE: 'Order Status page',
  POPUP: 'Popup'
};

const triggerEventMap = {
  ADD: 'Add to cart',
  EXIT: 'Exit intent',
  LOAD: 'Page load',
  FOCUS: 'Lost browser focus',
  SCROLL: 'Page scroll',
  LINK: 'Link click'
};

const triggerPageMap = {
  ANY: 'Any page',
  PAGE: 'Specific page',
  PATTERN: 'URL pattern'
};

const OfferSummary = ({ offer }) => {
  const { shop } = useShop();
  const { locale, countryCode, currency } = shop || {};
  const { formatNumber, formatPercentage } = useNumberFormatter({
    locale,
    countryCode,
    currency
  });
  const { formatCurrency } = useCurrency({ locale, countryCode, currency });
  const { formatDate } = useDateTime();

  const items = useMemo(() => {
    const newItems = [];

    newItems.push(`${strategyMap[offer.strategy]} strategy`);
    newItems.push(`${triggerEventMap[offer.triggerEvent]} trigger`);
    newItems.push(`${triggerPageMap[offer.triggerPage]} as trigger`);

    // Discount type
    if (offer.discountType === 'PERCENTAGE' && offer.discountValue) {
      newItems.push(`${offer.discountValue * 100}% off accepted products`);
    }
    if (offer.discountType === 'AMOUNT' && offer.discountValue) {
      newItems.push(`${formatCurrency(offer.discountValue)} off accepted products`);
    }
    if (offer.discountType === 'SET_PRICE' && offer.discountValue) {
      newItems.push(`${formatCurrency(offer.discountValue)} for each accepted product`);
    }

    // Minimum requirement
    if (offer.minimumRequirement === 'AMOUNT' && offer.minimumRequiredAmount) {
      newItems.push(`Minimum purchase of ${formatCurrency(offer.minimumRequiredAmount)}`);
    }
    if (offer.minimumRequirement === 'QUANTITY' && offer.minimumRequiredAmount) {
      newItems.push(`Minimum purchase of ${offer.minimumRequiredAmount} items`);
    }

    // Dates
    if (offer.startAt && offer.endAt) {
      newItems.push(`Active from ${formatDate(offer.startAt, 'MMM d, y')} to ${formatDate(offer.endAt, 'MMM d, y')}`);
    } else if (offer.startAt) {
      newItems.push(`Active from ${formatDate(offer.startAt, 'MMM d, y')}`);
    }

    if (offer.enableBundling) {
      newItems.push(`Products offered in bundle`);
    }

    if (offer.geotargetingCountries?.length > 0) {
      newItems.push(`Geotarget countries: ${offer.geotargetingCountries.join(', ')}`);
    }

    return newItems;
  }, [offer, formatCurrency, formatDate]);

  return (
    <Card>
      <BlockStack gap="400" padding="400">
        <Text variant="headingMd">Summary</Text>
        {offer.name ? (
          <BlockStack gap="200">
            <InlineStack align="space-between">
              <Text variant="headingMd">{offer.name}</Text>
              <OfferStatus offer={offer} />
            </InlineStack>
            {items.length > 0 && (
              <List>
                {items.map((item, index) => (
                  <List.Item key={index}>{item}</List.Item>
                ))}
              </List>
            )}
          </BlockStack>
        ) : (
          <Text tone="subdued">No information entered yet.</Text>
        )}
        {offer._id && (
          <>
            <Text variant="headingMd">Performance</Text>
            <List>
              <List.Item>{formatNumber(offer?.impressionCount)} impressions</List.Item>
              <List.Item>{formatNumber(offer?.acceptanceCount)} acceptances</List.Item>
              <List.Item>{formatPercentage(offer?.conversionRate, 1)} conversion rate</List.Item>
              <List.Item>{formatCurrency(offer?.revenueIncrease)} revenue increase</List.Item>
              {/* <List.Item>44 data submissions</List.Item> */}
            </List>
          </>
        )}
      </BlockStack>
    </Card>
  );
};

OfferSummary.propTypes = {
  offer: PropTypes.object.isRequired
};

export default OfferSummary;
