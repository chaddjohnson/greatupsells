import { useState, useCallback } from 'react';
import {
  Layout,
  Card,
  DataTable,
  Filters,
  EmptyState,
  Link,
  ChoiceList,
  Pagination
} from '@shopify/polaris';
import styled from 'styled-components';

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

const rows = [
  [
    <Link
      key={0}
      url="/offers/f85564907759ae76f3c8c5363b7b9752/"
      prefetch={false}
    >
      <LinkText>First Offer</LinkText>
    </Link>,
    140,
    '6%',
    14,
    '$875.00'
  ],
  [
    <Link
      key={1}
      url="/offers/ac75b776a8c1dca148c9d6d8f4fec22f/"
      prefetch={false}
    >
      <LinkText>Second Offer</LinkText>
    </Link>,
    83,
    '3.5%',
    8,
    '$230.00'
  ],
  [
    <Link
      key={3}
      url="/offers/322cbdad3ba7f3e4169fb9d1f5371201/"
      prefetch={false}
    >
      <LinkText>Third Offer</LinkText>
    </Link>,
    32,
    '4%',
    4,
    '$445.00'
  ]
];

const OfferList = () => {
  const [query, setQuery] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  const handleQueryChange = useCallback((value) => setQuery(value), []);
  const handleQueryRemove = useCallback(() => setQuery(null), []);
  const handleStatusFilterChange = useCallback(
    (value) => setStatusFilter(value),
    []
  );
  const handleStatusFilterRemove = useCallback(() => setStatusFilter(null), []);
  const handleFiltersRemoveAll = useCallback(() => {
    handleQueryRemove();
    handleStatusFilterRemove();
  }, [handleQueryRemove, handleStatusFilterRemove]);

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
      {rows.length > 0 ? (
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
      ) : (
        <EmptyState
          heading="Manage your offers"
          action={{ content: 'Add offer', url: '/offers/new/' }}
          image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
        >
          Create new offers to increase your sales.
        </EmptyState>
      )}
    </Layout>
  );
};

export default OfferList;
