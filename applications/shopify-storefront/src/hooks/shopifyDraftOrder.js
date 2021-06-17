import useSWR from 'swr';
import { useHttpClient } from '@neatowebsolutions/upselling-react-hooks';

const useShopifyDraftOrder = () => {
  const { httpClient } = useHttpClient();

  const { data: draftOrder, error: draftOrderError } = useSWR(
    '',
    httpClient.get.bind(httpClient),
    { revalidateOnFocus: false }
  );
  const draftOrderLoading = !draftOrder && !draftOrderError;

  const createShopifyDraftOrder = async (data) => {
    const url = `/draft-orders`;
    const newDraftOrder = await httpClient.post(url, data);

    return newDraftOrder;
  };

  const addProductToShopifyDraftOrder = async (
    draftOrderId,
    { offerId, shopifyVariantId, quantity }
  ) => {
    const url = `/draft-orders/${draftOrderId}/line-items`;
    const updatedDraftOrder = await httpClient.post(url, {
      offerId,
      shopifyVariantId,
      quantity
    });

    return updatedDraftOrder;
  };

  return {
    draftOrder,
    draftOrderError,
    draftOrderLoading,
    createShopifyDraftOrder,
    addProductToShopifyDraftOrder
  };
};

export default useShopifyDraftOrder;
