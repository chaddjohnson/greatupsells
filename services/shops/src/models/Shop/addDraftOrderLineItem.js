const buildDraftOrderLineItem = require('./buildDraftOrderLineItem');

const addDraftOrderLineItem = async (
  shop,
  draftOrderId,
  { offerId, shopifyVariantId, quantity }
) => {
  const shopifyApiClient = shop.getShopifyApiClient();

  // Retrieve the draft order data directly from Shopify.
  let draftOrder = await shopifyApiClient.draftOrder.get(draftOrderId);

  const lineItem = await buildDraftOrderLineItem({
    offerId,
    shopifyVariantId,
    quantity
  });

  // Add the line item to the draft order.
  draftOrder.line_items.push(lineItem);

  // Save the updated draft order directly with Shopify.
  draftOrder = await shopifyApiClient.draftOrder.update(
    draftOrderId,
    draftOrder
  );

  return draftOrder;
};

module.exports = addDraftOrderLineItem;
