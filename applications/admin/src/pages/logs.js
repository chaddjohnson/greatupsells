import Head from 'next/head';
import { Notes as LogsIcon } from '@material-ui/icons';
import { Layout } from '../components';

const LogsPage = () => (
  <>
    <Head>
      <title>Logs</title>
    </Head>
    <Layout title="Logs" icon={<LogsIcon />}>
      Logs page
    </Layout>
  </>
);

export default LogsPage;
