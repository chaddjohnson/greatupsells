import { Layout, Card, DataTable, EmptyState, Link } from '@shopify/polaris';

export default () => {
  const rows = [
    [
      <Link key={0} url="/offers/first-offer">
        First Offer
      </Link>,
      '$875.00',
      124689,
      140,
      '$122,500.00'
    ],
    [
      <Link key={1} url="/offers/second-offer">
        Second Offer
      </Link>,
      '$230.00',
      124533,
      83,
      '$19,090.00'
    ],
    [
      <Link key={3} url="/offers/third-offer">
        Thirdd Offer
      </Link>,
      '$445.00',
      124518,
      32,
      '$14,240.00'
    ]
  ];

  return (
    <Layout>
      {rows.length > 0 ? (
        <Layout.Section>
          <Card>
            <DataTable
              columnContentTypes={['text', 'numeric', 'numeric', 'numeric']}
              headings={[
                'Name',
                'Views',
                'Conversion Rate',
                'Revenue Increase'
              ]}
              rows={rows}
              totals={['', '', '', 255, '$155,830.00']}
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
