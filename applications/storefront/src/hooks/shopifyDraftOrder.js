import { useHttpClient } from '@greatupsells/react-hooks';

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
    const data = [
      {
        offerId,
        shopifyVariantId,
        quantity: parseInt(quantity)
      }
    ];
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

  const updateShopifyDraftOrderVariantQuantity = async (
    draftOrderId,
    shopifyVariantId,
    quantity
  ) => {
    const url = `/draft-orders/${draftOrderId}/line-items/${shopifyVariantId}`;
    const data = { quantity: parseInt(quantity) };
    const draftOrder = await httpClient.post(url, data);

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
    addVariantsToShopifyDraftOrder,
    updateShopifyDraftOrderVariantQuantity,
    removeShopifyDraftOrderVariant
  };
};

export default useShopifyDraftOrder;
