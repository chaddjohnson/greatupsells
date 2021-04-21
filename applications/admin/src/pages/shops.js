import Head from 'next/head';
import { Store as ShopIcon } from '@material-ui/icons';
import { Layout } from '../components';

const ShopsPage = () => (
  <>
    <Head>
      <title>Shops</title>
    </Head>
    <Layout title="Shops" icon={<ShopIcon />}>
      Shops page
    </Layout>
  </>
);

export default ShopsPage;
