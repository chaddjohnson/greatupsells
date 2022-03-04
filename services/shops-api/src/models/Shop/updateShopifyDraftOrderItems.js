const updateItemQuantity = (draftOrder, shopifyCartItems, shopifyCartItem) => {
  const { shopifyVariantId, quantity } = shopifyCartItem;

  // Get a total quantity of the current variant in the draft order.
  const totalDraftOrderQuantity = draftOrder.line_items.reduce(
    (sum, lineItem) =>
      sum + (lineItem.variant_id === shopifyVariantId ? lineItem.quantity : 0),
    0
  );

  // Get a total quantity of the current variant in the Shopify cart.
  const totalShopifyCartQuantity = shopifyCartItems.reduce(
    (sum, item) =>
      sum + (item.shopifyVariantId === shopifyVariantId ? item.quantity : 0),
    0
  );

  // Find the non-discounted item in the draft order.
  const nonDiscountedDraftOrderItem = draftOrder.line_items.find(
    (lineItem) =>
      lineItem.variant_id === shopifyVariantId && !lineItem.applied_discount
  );

  // Find the discounted item in the draft order.
  const discountedDraftOrderItem = draftOrder.line_items.find(
    (lineItem) =>
      lineItem.variant_id === shopifyVariantId && !!lineItem.applied_discount
  );

  let itemsToRemove = 0;
  let nonDiscountedItemsToRemove = 0;
  let discountedItemsToRemove = 0;

  // If there are fewer items in the draft order than in the Shopify cart,
  // then increase the quantity for non-discounted items in the draft order.
  if (totalDraftOrderQuantity < totalShopifyCartQuantity) {
    if (nonDiscountedDraftOrderItem) {
      nonDiscountedDraftOrderItem.quantity =
        totalShopifyCartQuantity - (discountedDraftOrderItem?.quantity || 0);
    } else {
      // The item is not in the draft order, so add it.
      draftOrder.line_items.push({
        variant_id: shopifyVariantId,
        quantity: quantity - totalDraftOrderQuantity
      });
    }
  }

  // If there are more items in the draft order than in the Shopify cart, then
  // first attempt to remove non-discounted items from the cart. If there are
  // still more items in the draft order than in the Shopify cart, remove some
  // discounted items from the draft order.
  if (totalDraftOrderQuantity > totalShopifyCartQuantity) {
    itemsToRemove = totalDraftOrderQuantity - totalShopifyCartQuantity;
    nonDiscountedItemsToRemove = nonDiscountedDraftOrderItem
      ? Math.max(
          Math.min(nonDiscountedDraftOrderItem.quantity, itemsToRemove),
          0
        )
      : 0;
    discountedItemsToRemove = discountedDraftOrderItem
      ? Math.max(
          Math.min(
            discountedDraftOrderItem.quantity,
            itemsToRemove - nonDiscountedItemsToRemove
          ),
          0
        )
      : 0;

    if (nonDiscountedDraftOrderItem) {
      nonDiscountedDraftOrderItem.quantity -= nonDiscountedItemsToRemove;
    }

    if (discountedDraftOrderItem) {
      discountedDraftOrderItem.quantity -= discountedItemsToRemove;
    }
  }
};

const updateShopifyDraftOrderItems = async (
  shop,
  draftOrderId,
  shopifyCartItems
) => {
  const shopifyApiClient = shop.getShopifyApiClient();

  // Retrieve the draft order data directly from Shopify.
  let draftOrder = await shopifyApiClient.draftOrder.get(draftOrderId);

  let discountedLineItemCount = 0;

  // Ensure draft order line items reflect Shopify cart items.
  shopifyCartItems.forEach((shopifyCartItem) => {
    updateItemQuantity(draftOrder, shopifyCartItems, shopifyCartItem);
  });

  // Remove line items having zero quantity;
  draftOrder.line_items = draftOrder.line_items.filter(
    (lineItem) => lineItem.quantity > 0
  );

  // Remove draft order items not in the cart.
  draftOrder.line_items = draftOrder.line_items.filter((lineItem) => {
    return !!shopifyCartItems.find(
      (item) => item.shopifyVariantId === lineItem.variant_id
    );
  });

  // Count the remaining discounted line items.
  discountedLineItemCount = draftOrder.line_items.filter(
    (lineItem) => !!lineItem.applied_discount
  ).length;

  // Delete the draft order if there are no more discounted line items.
  if (discountedLineItemCount === 0) {
    await shopifyApiClient.draftOrder.delete(draftOrderId);
    draftOrder = null;
  }

  if (draftOrder) {
    // Update the draft order.
    draftOrder = await shopifyApiClient.draftOrder.update(
      draftOrderId,
      draftOrder
    );
  }

  // Return the draft order.
  return draftOrder;
};

module.exports = updateShopifyDraftOrderItems;
