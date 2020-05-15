import { memo } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { Loading } from '@shopify/app-bridge-react';
import { Page } from '@shopify/polaris';
import { TitleBar, OfferForm } from '../../components';
import { OFFER } from '../../graphql/queries';

const PageTitleBar = memo(() => (
  <TitleBar
    title="Edit offer"
    primaryAction={null}
    breadcrumbs={[{ content: 'Offers', url: '/offers' }]}
  />
));

const OfferEditPage = () => {
  const router = useRouter();
  const { loading, data } = useQuery(OFFER, {
    variables: {
      id: router.query.id
    }
  });
  const { offer } = data;

  if (loading) {
    return <Loading />;
  }

  return (
    <Page title={offer.name}>
      <PageTitleBar />
      <OfferForm offer={offer} />
    </Page>
  );
};

export default OfferEditPage;
