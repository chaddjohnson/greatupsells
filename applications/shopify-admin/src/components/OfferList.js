import React, { useState, useMemo, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  IndexFilters,
  IndexTable,
  Text,
  BlockStack,
  InlineStack,
  Box,
  useSetIndexFiltersMode,
  IndexFiltersMode
} from '@shopify/polaris';
import { useNumberFormatter, useCurrency } from '@greatupsells/react-hooks';
import styled from 'styled-components';
import { useShop } from '../hooks';
import OfferStatus from './OfferStatus';
import OfferStrategy from './OfferStrategy';
import Link from './Link';

const OfferLink = styled(Link)`
  color: #202223;
  text-decoration: none;
`;

const OfferListRow = ({ offer }) => {
  const { shop } = useShop();
  const { locale, countryCode, currency } = shop || {};
  const { formatNumber, formatPercentage } = useNumberFormatter({
    locale,
    countryCode,
    currency
  });
  const { formatCurrency } = useCurrency({ locale, countryCode, currency });

  const description = useMemo(() => {
    if (!offer.discountValue) {
      return undefined;
    }

    if (offer.discountType === 'PERCENTAGE') {
      return `${offer.discountValue * 100}% off accepted products`;
    }
    if (offer.discountType === 'AMOUNT') {
      return `${formatCurrency(offer.discountValue)} off accepted products`;
    }
    if (offer.discountType === 'SET_PRICE') {
      return `${formatCurrency(offer.discountValue)} for each accepted product`;
    }
  }, [offer, formatCurrency]);

  return (
    <IndexTable.Row id={offer._id}>
      <IndexTable.Cell>
        <BlockStack gap="200">
          <Text variant="headingMd" as="h3">
            <OfferLink url={`/offers/${offer._id}`} data-primary-link>
              {offer.name}
            </OfferLink>
          </Text>
          <span>{description}</span>
        </BlockStack>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <OfferStatus offer={offer} />
      </IndexTable.Cell>
      <IndexTable.Cell>{formatNumber(offer.impressionCount)}</IndexTable.Cell>
      <IndexTable.Cell>{formatNumber(offer.acceptanceCount)}</IndexTable.Cell>
      <IndexTable.Cell>{formatPercentage(offer.conversionRate, 1)}</IndexTable.Cell>
      <IndexTable.Cell>{formatCurrency(offer.revenueIncrease)}</IndexTable.Cell>
      <IndexTable.Cell>
        <OfferStrategy offer={offer} />
      </IndexTable.Cell>
    </IndexTable.Row>
  );
};

OfferListRow.propTypes = {
  offer: PropTypes.object.isRequired
};

const tabs = [
  {
    id: 'all',
    content: 'All'
  },
  {
    id: 'active',
    content: 'Active'
  },
  {
    id: 'pending',
    content: 'Pending'
  },
  {
    id: 'expired',
    content: 'Expired'
  },
  {
    id: 'disabled',
    content: 'Disabled'
  }
];

const OfferList = ({ offers, loading = false, filters = {}, onFilter = () => {} }) => {
  const filteredTabIndex = tabs.findIndex(({ id }) => id === filters?.status);

  const [query, setQuery] = useState(filters.query);
  const [selectedTabIndex, setSelectedTabIndex] = useState(filteredTabIndex > -1 ? filteredTabIndex : 0);
  const { mode, setMode } = useSetIndexFiltersMode(IndexFiltersMode.Default);

  const debounceChange = useRef();

  const handleTabChange = useCallback(
    (tabIndex) => {
      const status = tabs[tabIndex].id;
      const updatedFilters = { query, status };

      setSelectedTabIndex(tabIndex);
      onFilter(updatedFilters);
    },
    [query, onFilter]
  );

  const handleQueryChange = useCallback(
    (value) => {
      const status = tabs[selectedTabIndex].id;
      const updatedFilters = { query: value, status };

      setQuery(value);

      if (debounceChange.current) {
        clearTimeout(debounceChange.current);
      }

      debounceChange.current = setTimeout(() => onFilter(updatedFilters), 500);
    },
    [selectedTabIndex, onFilter]
  );

  const handleQueryClear = useCallback(() => {
    const status = tabs[selectedTabIndex].id;
    const updatedFilters = { query: '', status };

    setQuery('');
    onFilter(updatedFilters);
  }, [selectedTabIndex, onFilter]);

  const handlePaginatePrevious = useCallback(() => {
    // Implement pagination logic here
  }, []);

  const handlePaginateNext = useCallback(() => {
    // Implement pagination logic here
  }, []);

  return (
    <>
      <IndexFilters
        queryValue={query}
        filters={[]}
        appliedFilters={[]}
        queryPlaceholder="Search offers"
        onQueryChange={handleQueryChange}
        onQueryClear={handleQueryClear}
        cancelAction={{
          onAction: () => {},
          disabled: false,
          loading: false
        }}
        tabs={tabs}
        selected={selectedTabIndex}
        onSelect={handleTabChange}
        loading={loading}
        canCreateNewView={false}
        mode={mode}
        setMode={setMode}
      />
      <IndexTable
        resourceName={{
          singular: 'offer',
          plural: 'offers'
        }}
        itemCount={offers?.length || 0}
        headings={[
          { title: 'Name' },
          { title: 'Status' },
          { title: 'Offer impressions' },
          { title: 'Offers accepted' },
          { title: 'Conversion rate' },
          { title: 'Revenue increase' },
          { title: 'Strategy' }
        ]}
        pagination={{
          hasPrevious: true,
          hasNext: true,
          onPrevious: handlePaginatePrevious,
          onNext: handlePaginateNext
        }}
        selectable={false}
        loading={loading}
      >
        {offers?.map((offer, index) => (
          <OfferListRow key={index} offer={offer} />
        ))}
      </IndexTable>
    </>
  );
};

OfferList.propTypes = {
  offers: PropTypes.arrayOf(PropTypes.object),
  filters: PropTypes.object,
  onFilter: PropTypes.func
};

export default OfferList;
