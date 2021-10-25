import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Card,
  Heading,
  TextStyle,
  Stack,
  List,
  Button,
  Badge
} from '@shopify/polaris';
import { useNumberFormatter, useDateTime } from '@greatupsellsreact-hooks';
import { useShop } from '../../hooks';

const HeadingWrapper = styled.div`
  .Polaris-Stack {
    flex-wrap: nowrap;
  }

  .Polaris-Stack__Item:first-child {
    flex: 1 1 auto;
  }
`;

const StatusBadge = ({ offer }) => {
  if (!offer._id) {
    return null;
  }

  if (!offer.enabled) {
    return <Badge>Disabled</Badge>;
  }

  if (offer.endAt && new Date(offer.endAt) < new Date()) {
    return <Badge status="warning">Expired</Badge>;
  }

  if (new Date(offer.startAt) > new Date()) {
    return <Badge status="info">Pending</Badge>;
  }

  if (offer.enabled) {
    return <Badge status="success">Active</Badge>;
  }

  return null;
};

StatusBadge.propTypes = {
  offer: PropTypes.object.isRequired
};

const OfferSummary = ({ offer }) => {
  const [items, setItems] = useState([]);

  const { shop } = useShop();
  const { locale, countryCode, currency } = shop || {};
  const {
    formatNumber,
    formatCurrency,
    formatPercentage
  } = useNumberFormatter({ locale, countryCode, currency });
  const { formatDate } = useDateTime();

  const buildItems = useCallback(() => {
    const newItems = [];

    if (offer.discountType === 'PERCENTAGE' && offer.discountValue) {
      newItems.push(`${offer.discountValue * 100}% off accepted products`);
    }
    if (offer.discountType === 'AMOUNT' && offer.discountValue) {
      newItems.push(
        `${formatCurrency(offer.discountValue)} off accepted products`
      );
    }
    if (offer.discountType === 'SET_PRICE' && offer.discountValue) {
      newItems.push(
        `${formatCurrency(offer.discountValue)} for each accepted product`
      );
    }

    if (offer.minimumRequirement === 'AMOUNT' && offer.minimumRequiredAmount) {
      newItems.push(
        `Minimum purchase of ${formatCurrency(offer.minimumRequiredAmount)}`
      );
    }
    if (
      offer.minimumRequirement === 'QUANTITY' &&
      offer.minimumRequiredAmount
    ) {
      newItems.push(`Minimum purchase of ${offer.minimumRequiredAmount} items`);
    }

    if (offer.startAt && offer.endAt) {
      newItems.push(
        `Active from ${formatDate(offer.startAt, 'MMM d, y')} to ${formatDate(
          offer.endAt,
          'MMM d, y'
        )}`
      );
    } else if (offer.startAt) {
      newItems.push(`Active from ${formatDate(offer.startAt, 'MMM d, y')}`);
    }

    return newItems;
  }, [offer, formatCurrency, formatDate]);

  useEffect(() => {
    setItems(buildItems());
  }, [buildItems]);

  return (
    <Card title="Summary" subdued>
      <Card.Section>
        {offer.name ? (
          <Stack vertical>
            <HeadingWrapper>
              <Stack distribution="equalSpacing">
                <Heading element="h3">{offer.name}</Heading>
                <StatusBadge offer={offer} />
              </Stack>
            </HeadingWrapper>
            {items.length > 0 && (
              <List>
                {items.map((item, index) => (
                  <List.Item key={index}>{item}</List.Item>
                ))}
              </List>
            )}
          </Stack>
        ) : (
          <TextStyle variation="subdued">No information entered yet.</TextStyle>
        )}
      </Card.Section>
      {offer._id && (
        <Card.Section title="Performance" subdued>
          <Stack vertical>
            <List>
              <List.Item>
                {formatNumber(offer?.impressionCount)} impressions
              </List.Item>
              <List.Item>
                {formatNumber(offer?.acceptanceCount)} acceptances
              </List.Item>
              <List.Item>
                {formatPercentage(offer?.conversionRate, 1)} conversion rate
              </List.Item>
              <List.Item>
                {formatCurrency(offer?.revenueIncrease)} revenue increase
              </List.Item>
              {/* <List.Item>44 data submissions</List.Item> */}
            </List>
            <TextStyle variation="subdued">
              View{' '}
              <Button plain url={`/offers/${offer._id}/analytics/`}>
                analytics
              </Button>{' '}
              {/* and{' '}
              <Button plain url={`/offers/${offer._id}/data/`}>
                data submissions
              </Button>{' '} */}
              for this offer
            </TextStyle>
          </Stack>
        </Card.Section>
      )}
    </Card>
  );
};

OfferSummary.propTypes = {
  offer: PropTypes.object.isRequired
};

export default OfferSummary;
