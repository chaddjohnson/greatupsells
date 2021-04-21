import Head from 'next/head';
import { PieChartOutlined as DashboardIcon } from '@material-ui/icons';
import { Layout } from '../components';

const DashboardPage = () => (
  <>
    <Head>
      <title>Dashboard</title>
    </Head>
    <Layout title="Dashboard" icon={<DashboardIcon />}>
      Dashboard page
    </Layout>
  </>
);

export default DashboardPage;
