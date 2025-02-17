import { useHttpClient } from '@greatupsells/react-hooks';

const useShopifyDraftOrder = () => {
  const { httpClient } = useHttpClient();

  const createShopifyDraftOrder = async (data) => {
    const url = `/draft-orders`;
    const draftOrder = await httpClient.post(url, data);

    return draftOrder;
  };

  const addVariantsToShopifyDraftOrder = async (draftOrderId, items) => {
    const url = `/draft-orders/${draftOrderId}/line-items`;
    const data = items.map(({ offerId, shopifyVariantId, quantity }) => ({
      offerId,
      shopifyVariantId,
      quantity: parseInt(quantity)
    }));
    const draftOrder = await httpClient.post(url, data);

    return draftOrder;
  };

  const updateShopifyDraftOrderItems = async (draftOrderId, shopifyCartItems) => {
    const url = `/draft-orders/${draftOrderId}/line-items`;
    const data = shopifyCartItems.map(({ variant_id: shopifyVariantId, quantity }) => ({
      shopifyVariantId,
      quantity
    }));
    const draftOrder = await httpClient.put(url, data);

    return draftOrder;
  };

  return {
    createShopifyDraftOrder,
    addVariantsToShopifyDraftOrder,
    updateShopifyDraftOrderItems
  };
};

export default useShopifyDraftOrder;
