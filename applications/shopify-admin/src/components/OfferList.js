import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Layout,
  Card,
  DataTable,
  Filters,
  Link,
  ChoiceList,
  Pagination
} from '@shopify/polaris';
import styled from 'styled-components';
import { useShop } from '@neatowebsolutions/upselling-react-hooks';

const isEmpty = (value) => {
  if (Array.isArray(value)) {
    return value.length === 0;
  } else {
    return value === '' || value == null;
  }
};

const HeadingText = styled.span`
  font-weight: 500;
`;

const LinkText = styled.span`
  font-weight: 600;
`;

const PaginationWrapper = styled.div`
  text-align: center;
`;

const OfferList = ({ offers }) => {
  const [query, setQuery] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  const { shop } = useShop();

  const formatCurrency = useCallback(
    (value) => {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: shop.currency || 'USD'
      });
      return formatter.format(value);
    },
    [shop.currency]
  );

  const rows = useMemo(
    () =>
      offers.map(
        (
          {
            _id,
            name,
            viewCount,
            conversionRate,
            acceptanceCount,
            revenueIncrease
          },
          index
        ) => [
          <Link key={index} url={`/offers/${_id}/`} prefetch={false}>
            <LinkText>{name}</LinkText>
          </Link>,
          viewCount,
          `${Math.round(conversionRate * 100 * 10) / 10}%`,
          acceptanceCount,
          formatCurrency(revenueIncrease)
        ]
      ),
    [offers, formatCurrency]
  );

  const handleQueryChange = (value) => {
    setQuery(value);
  };

  const handleQueryRemove = () => {
    setQuery(null);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  const handleStatusFilterRemove = () => {
    setStatusFilter(null);
  };

  const handleFiltersRemoveAll = () => {
    handleQueryRemove();
    handleStatusFilterRemove();
  };

  const filters = [
    {
      key: 'status',
      label: 'Status',
      filter: (
        <ChoiceList
          title="Status"
          titleHidden
          choices={[
            { label: 'Enabled', value: 'true' },
            { label: 'Disabled', value: 'false' }
          ]}
          selected={statusFilter || []}
          onChange={handleStatusFilterChange}
        />
      ),
      shortcut: true
    }
  ];

  const appliedFilters = [];

  if (!isEmpty(statusFilter)) {
    const key = 'status';
    appliedFilters.push({
      key,
      label: statusFilter ? 'Enabled' : 'Disabled',
      onRemove: handleStatusFilterRemove
    });
  }

  return (
    <Layout>
      <Layout.Section>
        <Card>
          <Card.Section>
            <Filters
              queryValue={query}
              filters={filters}
              queryPlaceholder="Filter offers"
              appliedFilters={appliedFilters}
              onQueryChange={handleQueryChange}
              onQueryClear={handleQueryRemove}
              onClearAll={handleFiltersRemoveAll}
            />
          </Card.Section>
          <DataTable
            columnContentTypes={[
              'text',
              'numeric',
              'numeric',
              'numeric',
              'numeric'
            ]}
            headings={[
              <HeadingText key="0">Name</HeadingText>,
              <HeadingText key="2">Views</HeadingText>,
              <HeadingText key="3">Conversion rate</HeadingText>,
              <HeadingText key="1">Acceptances</HeadingText>,
              <HeadingText key="4">Revenue increase</HeadingText>
            ]}
            rows={rows}
          />
          <Card.Section>
            <PaginationWrapper>
              <Pagination
                hasPrevious
                hasNext
                onPrevious={() => {}}
                onNext={() => {}}
              />
            </PaginationWrapper>
          </Card.Section>
        </Card>
      </Layout.Section>
    </Layout>
  );
};

OfferList.propTypes = {
  offers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      viewCount: PropTypes.number.isRequired,
      conversionRate: PropTypes.number.isRequired,
      acceptanceCount: PropTypes.number.isRequired,
      revenueIncrease: PropTypes.number.isRequired
    })
  )
};

export default OfferList;
