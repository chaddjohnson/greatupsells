const buildDraftOrderLineItem = require('./buildDraftOrderLineItem');

const addDraftOrderLineItem = async (
  shop,
  draftOrderId,
  { offerId, shopifyVariantId, quantity }
) => {
  const shopifyApiClient = shop.getShopifyApiClient();

  // Retrieve the draft order data directly from Shopify.
  let draftOrder = await shopifyApiClient.draftOrder.get(draftOrderId);

  // Determine if there is an existing non-discounted line item.
  const lineItem = draftOrder.line_items.find(
    (current) =>
      current.variant_id === shopifyVariantId && !current.applied_discount
  );

  if (lineItem && !offerId) {
    // Update the existing line item quantity.
    lineItem.quantity += quantity;
  } else {
    // Add a new line item.
    draftOrder.line_items.push(
      await buildDraftOrderLineItem({
        offerId,
        shopifyVariantId,
        quantity
      })
    );
  }

  // Save the updated draft order directly with Shopify.
  draftOrder = await shopifyApiClient.draftOrder.update(
    draftOrderId,
    draftOrder
  );

  return draftOrder;
};

module.exports = addDraftOrderLineItem;
