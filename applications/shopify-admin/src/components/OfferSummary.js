import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
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

const HeadingWrapper = styled.div`
  .Polaris-Stack {
    flex-wrap: nowrap;
  }

  .Polaris-Stack__Item:first-child {
    flex: 1 1 auto;
  }
`;

const StatusBadge = ({ offer }) => {
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

const OfferSummary = ({ offer, children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const buildItems = () => {
      const newItems = [];

      if (offer.startAt && offer.endAt) {
        newItems.push(
          `Active from ${moment(offer.startAt).format('MMM D')} to ${moment(
            offer.endAt
          ).format('MMM D')}`
        );
      } else if (offer.startAt) {
        newItems.push(`Active from ${moment(offer.startAt).format('MMM D')}`);
      }

      return newItems;
    };

    setItems(buildItems());
  }, [offer.startAt, offer.endAt]);

  return (
    <>
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
              <List.Item>7 acceptances</List.Item>
              <List.Item>$123.50 revenue increase</List.Item>
              <List.Item>205 views</List.Item>
              <List.Item>3.5% conversion rate</List.Item>
            </List>
            <TextStyle variation="subdued">
              View{' '}
              <Button
                plain
                url="/offers/a702955babd0e0c9bdcf176c13b60a1f/analytics"
              >
                analytics for this offer
              </Button>
            </TextStyle>
          </Stack>
        </Card.Section>
      )}
      {children}
    </>
  );
};

OfferSummary.propTypes = {
  offer: PropTypes.object.isRequired,
  children: PropTypes.node
};

export default OfferSummary;
