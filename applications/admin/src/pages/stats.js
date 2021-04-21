import Head from 'next/head';
import { BarChart as StatsIcon } from '@material-ui/icons';
import { Layout } from '../components';

const StatsPage = () => (
  <>
    <Head>
      <title>Stats</title>
    </Head>
    <Layout title="Stats" icon={<StatsIcon />}>
      Stats page
    </Layout>
  </>
);

export default StatsPage;
