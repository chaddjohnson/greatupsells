import { useState, useCallback } from 'react';
import {
  Layout,
  Card,
  DataTable,
  Filters,
  EmptyState,
  Link,
  ChoiceList
} from '@shopify/polaris';
import styled from 'styled-components';

const isEmpty = (value) => {
  if (Array.isArray(value)) {
    return value.length === 0;
  } else {
    return value === '' || value == null;
  }
};

const StyledHeadingText = styled.span`
  font-weight: 500;
`;

const StyledLinkText = styled.span`
  font-weight: 600;
`;

const rows = [
  [
    <Link key={0} url="/offers/first-offer">
      <StyledLinkText>First Offer</StyledLinkText>
    </Link>,
    140,
    '6%',
    '$875.00'
  ],
  [
    <Link key={1} url="/offers/second-offer">
      <StyledLinkText>Second Offer</StyledLinkText>
    </Link>,
    83,
    '3.5%',
    '$230.00'
  ],
  [
    <Link key={3} url="/offers/third-offer">
      <StyledLinkText>Third Offer</StyledLinkText>
    </Link>,
    32,
    '4%',
    '$445.00'
  ]
];

export default () => {
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
              columnContentTypes={['text', 'numeric', 'numeric', 'numeric']}
              headings={[
                <StyledHeadingText key="0">Name</StyledHeadingText>,
                <StyledHeadingText key="1">Views</StyledHeadingText>,
                <StyledHeadingText key="2">Conversion Rate</StyledHeadingText>,
                <StyledHeadingText key="3">Revenue Increase</StyledHeadingText>
              ]}
              rows={rows}
              totals={['', '', '', '$155,830.00']}
              showTotalsInFooter={true}
              footerContent={`Showing ${rows.length} of ${rows.length} results`}
            />
          </Card>
        </Layout.Section>
      ) : (
        <EmptyState
          heading="Manage your offers"
          action={{ content: 'Add offer', url: '/offers/new' }}
          image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
        >
          <p>Create new offers to increase your sales.</p>
        </EmptyState>
      )}
    </Layout>
  );
};
