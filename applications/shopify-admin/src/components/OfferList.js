import React, { useState, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  IndexTable,
  Tabs,
  TextStyle,
  Stack,
  Filters,
  Pagination,
  EmptyState
} from '@shopify/polaris';
import { useNumberFormatter, useCurrency } from '@greatupsells/react-hooks';
import styled from 'styled-components';
import { useShop } from '../hooks';
import OfferStatus from './OfferStatus';
import Link from './Link';

const FiltersWrapper = styled.div`
  padding: 1.5rem 1.5rem 0 1.5rem;
`;

const PaginationWrapper = styled.div`
  padding-top: 1rem;
  padding-bottom: 2.25rem;
`;

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
        <Stack spacing="extraTight" vertical>
          <TextStyle variation="strong">
            <OfferLink url={`/offers/${offer._id}`} data-primary-link>
              {offer.name}
            </OfferLink>
          </TextStyle>
          <span>{description}</span>
        </Stack>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <OfferStatus offer={offer} />
      </IndexTable.Cell>
      <IndexTable.Cell>{formatNumber(offer.impressionCount)}</IndexTable.Cell>
      <IndexTable.Cell>
        {formatPercentage(offer.conversionRate, 1)}
      </IndexTable.Cell>
      <IndexTable.Cell>{formatNumber(offer.acceptanceCount)}</IndexTable.Cell>
      <IndexTable.Cell>{formatCurrency(offer.revenueIncrease)}</IndexTable.Cell>
    </IndexTable.Row>
  );
};

OfferListRow.propTypes = {
  offer: PropTypes.object.isRequired
};

const tabs = [
  {
    id: 'all',
    content: 'All',
    accessibilityLabel: 'All',
    panelID: 'all'
  },
  {
    id: 'active',
    content: 'Active',
    accessibilityLabel: 'Active',
    panelID: 'active'
  },
  {
    id: 'pending',
    content: 'Pending',
    accessibilityLabel: 'Pending',
    panelID: 'pending'
  },
  {
    id: 'expired',
    content: 'Expired',
    accessibilityLabel: 'Expired',
    panelID: 'expired'
  },
  {
    id: 'disabled',
    content: 'Disabled',
    accessibilityLabel: 'Disabled',
    panelID: 'disabled'
  }
];

const OfferList = ({ offers, filters, onFilter }) => {
  const [query, setQuery] = useState(filters.query);
  const debounceChange = useRef();

  const selectedTabIndex = useMemo(() => {
    const statusIndex = tabs.findIndex(({ id }) => id === filters?.status);

    return statusIndex > -1 ? statusIndex : 0;
  }, [filters]);

  const offerFilterText =
    selectedTabIndex > 0 ? tabs[selectedTabIndex]?.content.toLowerCase() : '';

  const handleTabChange = (tabIndex) => {
    const status = tabs[tabIndex].id;
    const updatedFilters = { query, status };

    onFilter(updatedFilters);
  };

  const handleQueryChange = (value) => {
    const status = tabs[selectedTabIndex].id;
    const updatedFilters = { query: value, status };

    setQuery(value);

    if (debounceChange.current) {
      clearTimeout(debounceChange.current);
    }

    debounceChange.current = setTimeout(
      () => onFilter(updatedFilters),
      0.5 * 1000
    );
  };

  const handleQueryClear = () => {
    const status = tabs[selectedTabIndex].id;
    const updatedFilters = { query: '', status };

    setQuery('');
    onFilter(updatedFilters);
  };

  const handlePaginatePrevious = () => {
    //   if () {
    //     return;
    //   }
    //   const status = tabs[selectedTabIndex].id;
    //   const cursor = offers?.[offers.length - 1]?._id;
    //   const updatedFilters = { query, status, cursor };
    //   onFilter(updatedFilters);
  };

  const handlePaginateNext = () => {
    //   if () {
    //     return;
    //   }
  };

  return (
    <Card>
      <Tabs tabs={tabs} selected={selectedTabIndex} onSelect={handleTabChange}>
        <FiltersWrapper>
          <Filters
            queryValue={query}
            filters={[]}
            appliedFilters={[]}
            queryPlaceholder="Search offers"
            onQueryChange={handleQueryChange}
            onQueryClear={handleQueryClear}
          />
        </FiltersWrapper>
        {offers?.length > 0 ? (
          <>
            <IndexTable
              resourceName={{
                singular: 'offer',
                plural: 'offers'
              }}
              itemCount={offers?.length || 0}
              headings={[
                { title: 'Name' },
                { title: 'Status' },
                { title: 'Impressions' },
                { title: 'Conversion rate' },
                { title: 'Acceptances' },
                { title: 'Revenue increase' }
              ]}
              selectable={false}
            >
              {offers?.map((offer, index) => (
                <OfferListRow key={index} offer={offer} />
              ))}
            </IndexTable>
            <PaginationWrapper>
              <Stack distribution="center">
                <Pagination
                  hasPrevious={true}
                  hasNext={true}
                  onPrevious={handlePaginatePrevious}
                  onNext={handlePaginateNext}
                />
              </Stack>
            </PaginationWrapper>
          </>
        ) : (
          <EmptyState heading={`No ${offerFilterText} offers found`} />
        )}
      </Tabs>
    </Card>
  );
};

OfferList.propTypes = {
  offers: PropTypes.arrayOf(PropTypes.object),
  filters: PropTypes.object,
  onFilter: PropTypes.func
};

OfferList.defaultProps = {
  filters: {},
  onFilter: () => {}
};

export default OfferList;
