import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Card, Text, List, BlockStack, InlineStack } from '@shopify/polaris';
import { useNumberFormatter, useCurrency, useDateTime } from '@greatupsells/react-hooks';
import { useShop } from '../../hooks';
import { Link } from '..';
import OfferStatus from '../OfferStatus';

const HeadingWrapper = styled.div`
  .Polaris-Stack {
    flex-wrap: nowrap;
  }

  .Polaris-Stack__Item:first-child {
    flex: 1 1 auto;
  }
`;

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

    if (offer.discountType === 'PERCENTAGE' && offer.discountValue) {
      newItems.push(`${offer.discountValue * 100}% off accepted products`);
    }
    if (offer.discountType === 'AMOUNT' && offer.discountValue) {
      newItems.push(`${formatCurrency(offer.discountValue)} off accepted products`);
    }
    if (offer.discountType === 'SET_PRICE' && offer.discountValue) {
      newItems.push(`${formatCurrency(offer.discountValue)} for each accepted product`);
    }

    if (offer.minimumRequirement === 'AMOUNT' && offer.minimumRequiredAmount) {
      newItems.push(`Minimum purchase of ${formatCurrency(offer.minimumRequiredAmount)}`);
    }
    if (offer.minimumRequirement === 'QUANTITY' && offer.minimumRequiredAmount) {
      newItems.push(`Minimum purchase of ${offer.minimumRequiredAmount} items`);
    }

    if (offer.startAt && offer.endAt) {
      newItems.push(`Active from ${formatDate(offer.startAt, 'MMM d, y')} to ${formatDate(offer.endAt, 'MMM d, y')}`);
    } else if (offer.startAt) {
      newItems.push(`Active from ${formatDate(offer.startAt, 'MMM d, y')}`);
    }

    return newItems;
  }, [offer, formatCurrency, formatDate]);

  return (
    <Card>
      <BlockStack gap="400" padding="400">
        <Text variant="headingMd">Summary</Text>
        {offer.name ? (
          <BlockStack gap="200">
            <HeadingWrapper>
              <InlineStack align="space-between">
                <Text variant="headingMd" as="h2">
                  {offer.name}
                </Text>
                <OfferStatus offer={offer} />
              </InlineStack>
            </HeadingWrapper>
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
            <Text tone="subdued">
              View <Link url={`/offers/${offer._id}/analytics/`}>analytics</Link>{' '}
              {/* and{' '}
                <Button variant="plain" url={`/offers/${offer._id}/data/`}>
                  data submissions
                </Button>{' '} */}
              for this offer
            </Text>
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
