import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment-timezone';
import { Heading, TextStyle, List } from '@shopify/polaris';

const SummaryList = styled.div`
  margin-top: 16px;
`;

const OfferSummary = (props) => {
  const { offer } = props;
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

  if (!offer.name) {
    return (
      <TextStyle variation="subdued">No information entered yet.</TextStyle>
    );
  }

  return (
    <>
      <Heading element="h3">{offer.name}</Heading>
      {items.length > 0 && (
        <SummaryList>
          {items.map((item, index) => (
            <List.Item key={index}>{item}</List.Item>
          ))}
        </SummaryList>
      )}
    </>
  );
};

OfferSummary.propTypes = {
  offer: PropTypes.object.isRequired
};

export default OfferSummary;
