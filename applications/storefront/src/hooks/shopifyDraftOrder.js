import { useHttpClient } from '@greatupsellsreact-hooks';

const useShopifyDraftOrder = () => {
  const { httpClient } = useHttpClient();

  const createShopifyDraftOrder = async (data) => {
    const url = `/draft-orders`;
    const draftOrder = await httpClient.post(url, data);

    return draftOrder;
  };

  const addVariantToShopifyDraftOrder = async (
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

  const updateShopifyDraftOrderVariantQuantity = async (
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

  const removeShopifyDraftOrderVariant = async (
    draftOrderId,
    shopifyVariantId
  ) => {
    return await updateShopifyDraftOrderVariantQuantity(
      draftOrderId,
      shopifyVariantId,
      0
    );
  };

  return {
    createShopifyDraftOrder,
    addVariantToShopifyDraftOrder,
    updateShopifyDraftOrderVariantQuantity,
    removeShopifyDraftOrderVariant
  };
};

export default useShopifyDraftOrder;
