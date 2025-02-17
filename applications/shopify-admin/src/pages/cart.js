import { memo, useState } from 'react';
import { Page, Layout, Card, Checkbox } from '@shopify/polaris';
import { TitleBar } from '../components';

const PageTitleBar = memo(() => <TitleBar title="Cart drawer" />);

const CartPage = () => {
  const [enabled, setEnabled] = useState(false);

  const handleEnable = (value) => {
    setEnabled(value);
  };

  return (
    <Page title="Cart drawer">
      <PageTitleBar />
      <Layout>
        <Layout.Section fullWidth>
          <Card>
            <Card.Section>
              <Checkbox
                label="Enable Cart Drawer"
                helpText={enabled && 'This will show as a cart replacement whenever Cart links and buttons are clicked.'}
                checked={enabled}
                onChange={handleEnable}
              />
            </Card.Section>
            {enabled && <Card.Section title="Theme"></Card.Section>}
            {enabled && <Card.Section title="Options"></Card.Section>}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default CartPage;
