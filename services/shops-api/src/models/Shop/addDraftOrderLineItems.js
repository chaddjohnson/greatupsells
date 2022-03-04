const Promise = require('bluebird');
const buildDraftOrderLineItem = require('./buildDraftOrderLineItem');

const addDraftOrderLineItems = async (shop, draftOrderId, items) => {
  const shopifyApiClient = shop.getShopifyApiClient();

  // Retrieve the draft order data directly from Shopify.
  let draftOrder = await shopifyApiClient.draftOrder.get(draftOrderId);

  // Handle each item, in order.
  await Promise.mapSeries(
    items,
    async ({ offerId, shopifyVariantId, quantity }) => {
      const lineItem = draftOrder.line_items.find((current) =>
        current.variant_id === shopifyVariantId && offerId
          ? !!current.applied_discount
          : current.applied_discount
      );

      quantity = parseInt(quantity);

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
    }
  );

  // Save the updated draft order directly with Shopify.
  draftOrder = await shopifyApiClient.draftOrder.update(
    draftOrderId,
    draftOrder
  );

  return draftOrder;
};

module.exports = addDraftOrderLineItems;
