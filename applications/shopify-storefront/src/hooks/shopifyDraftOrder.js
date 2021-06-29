import { useHttpClient } from '@neatowebsolutions/upselling-react-hooks';

const useShopifyDraftOrder = () => {
  const { httpClient } = useHttpClient();

  const createShopifyDraftOrder = async (data) => {
    const url = `/draft-orders`;
    const draftOrder = await httpClient.post(url, data);

    return draftOrder;
  };

  const addProductToShopifyDraftOrder = async (
    draftOrderId,
    { offerId, shopifyVariantId, quantity = 1 }
  ) => {
    const url = `/draft-orders/${draftOrderId}/line-items`;
    const draftOrder = await httpClient.post(url, {
      offerId,
      shopifyVariantId,
      quantity: parseInt(quantity)
    });

    return draftOrder;
  };

  const updateDraftOrderLineItemQuantity = async (
    draftOrderId,
    shopifyVariantId,
    quantity
  ) => {
    const url = `/draft-orders/${draftOrderId}/line-items/${shopifyVariantId}`;
    const draftOrder = await httpClient.post(url, {
      quantity: parseInt(quantity)
    });

    return draftOrder;
  };

  return {
    createShopifyDraftOrder,
    addProductToShopifyDraftOrder,
    updateDraftOrderLineItemQuantity
  };
};

export default useShopifyDraftOrder;
