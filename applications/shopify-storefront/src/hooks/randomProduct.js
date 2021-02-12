import useSWR from 'swr';
import { useHttpClient } from '@neatowebsolutions/upselling-react-hooks';

const useRandomProduct = ({ offer }) => {
  const { httpClient } = useHttpClient();

  const offerId = offer && offer._id;
  const { data: product } = useSWR(
    offerId ? `/offers/{offerId}/products/random` : null,
    httpClient.get.bind(httpClient),
    { revalidateOnFocus: false }
  );

  return { product };
};

export default useRandomProduct;
