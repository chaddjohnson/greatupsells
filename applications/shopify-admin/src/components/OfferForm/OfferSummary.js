import React, { useState, useEffect } from 'react';
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
import { useDateTime } from '@neatowebsolutions/upselling-react-hooks';

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

  const { formatDate } = useDateTime();

  useEffect(() => {
    const buildItems = () => {
      const newItems = [];

      if (offer.startAt && offer.endAt) {
        newItems.push(
          `Active from ${formatDate(offer.startAt, 'MMM d')} to ${formatDate(
            offer.endAt,
            'MMM d'
          )}`
        );
      } else if (offer.startAt) {
        newItems.push(`Active from ${formatDate(offer.startAt, 'MMM d')}`);
      }

      return newItems;
    };

    setItems(buildItems());
  }, [offer.startAt, offer.endAt, formatDate]);

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
              <List.Item>205 impressions</List.Item>
              <List.Item>7 acceptances</List.Item>
              <List.Item>3.5% conversion rate</List.Item>
              <List.Item>$123.50 revenue increase</List.Item>
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
