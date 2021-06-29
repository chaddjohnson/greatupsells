const updateDraftOrderLineItemQuantity = async (
  shop,
  draftOrderId,
  shopifyVariantId,
  quantity
) => {
  // Ensure values are numeric.
  shopifyVariantId = parseInt(shopifyVariantId);
  quantity = parseInt(quantity);

  if (typeof quantity !== 'number' || quantity < 0) {
    throw new Error(
      `Invalid quantity "${quantity}" provided for draft order line item`
    );
  }

  const shopifyApiClient = shop.getShopifyApiClient();

  // Retrieve the draft order data directly from Shopify.
  let draftOrder = await shopifyApiClient.draftOrder.get(draftOrderId);

  let discountedLineItems = draftOrder.line_items.filter(
    (current) => !!current.applied_discount
  );
  const nonDiscountedLineItems = draftOrder.line_items.filter(
    (current) => !current.applied_discount
  );
  const discountedLineItem = discountedLineItems.find(
    (current) => current.variant_id === shopifyVariantId
  );
  const nonDiscountedLineItem = nonDiscountedLineItems.find(
    (current) => current.variant_id === shopifyVariantId
  );

  const lineItemQuantity =
    quantity === 0 ? 0 : Math.abs(quantity - discountedLineItem?.quantity);

  if (lineItemQuantity > 0) {
    if (nonDiscountedLineItem) {
      // Update the existing line item quantity.
      nonDiscountedLineItem.quantity = lineItemQuantity;
    } else {
      // Add a new, non-discounted line item since the existing one has a discount.
      draftOrder.line_items.push({
        variant_id: shopifyVariantId,
        quantity: lineItemQuantity
      });
    }
  }

  if (lineItemQuantity === 0) {
    draftOrder.line_items = draftOrder.line_items.filter(
      (current) => current.variant_id !== shopifyVariantId
    );
    discountedLineItems = draftOrder.line_items.filter(
      (current) => !!current.applied_discount
    );
  }

  // Remove the draft order if there are no longer any discounted items.
  if (discountedLineItems.length === 0) {
    await shopifyApiClient.draftOrder.delete(draftOrderId);
    return null;
  }

  // Save the updated draft order directly with Shopify.
  draftOrder = await shopifyApiClient.draftOrder.update(
    draftOrderId,
    draftOrder
  );

  return draftOrder;
};

module.exports = updateDraftOrderLineItemQuantity;
