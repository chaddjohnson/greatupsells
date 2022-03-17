const Promise = require('bluebird');
const models = require('..');

const updateOfferHits = async (
  draftOrder,
  discountedDraftOrderItem,
  quantityToRemove,
  attempts = 0
) => {
  if (attempts >= 3) {
    return;
  }

  const OfferHit = await models.get('OfferHit');

  // Find all offer hits associated with the draft order.
  const offerHits = await OfferHit.find({ shopifyDraftOrderId: draftOrder.id });

  // Find the first offer hit having the variant as an accepted product.
  const offerHit = offerHits.find(
    ({ acceptedProducts }) =>
      !!acceptedProducts.find(
        ({ shopifyVariantId }) =>
          shopifyVariantId === discountedDraftOrderItem.variant_id
      )
  );

  if (!offerHit) {
    return;
  }

  // Find the first accepted product for the variant.
  const acceptedProduct = offerHit.acceptedProducts.find(
    ({ shopifyVariantId }) =>
      shopifyVariantId === discountedDraftOrderItem.variant_id
  );

  let remainingQuantityToRemove = quantityToRemove;

  if (!acceptedProduct) {
    return;
  }

  // Reduce the quantity of the line item.
  if (acceptedProduct.quantity >= quantityToRemove) {
    remainingQuantityToRemove = 0;
    acceptedProduct.quantity -= quantityToRemove;
  } else if (acceptedProduct.quantity < quantityToRemove) {
    remainingQuantityToRemove = quantityToRemove - acceptedProduct.quantity;
    acceptedProduct.quantity = 0;
  }

  // Remove zero-quantity accepted products.
  offerHit.acceptedProducts = offerHit.acceptedProducts.filter(
    ({ quantity }) => quantity > 0
  );

  // Update the offer hit.
  await OfferHit.findByIdAndUpdate(offerHit.id, {
    acceptedProducts: offerHit.acceptedProducts
  });

  // Remove more items if necessary.
  if (remainingQuantityToRemove > 0) {
    await updateOfferHits(
      draftOrder,
      discountedDraftOrderItem,
      remainingQuantityToRemove,
      ++attempts
    );
  }
};

const updateItemQuantity = async (
  draftOrder,
  shopifyCartItems,
  shopifyCartItem
) => {
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

  let quantityToRemove = 0;
  let nonDiscountedQuantityToRemove = 0;
  let discountedQuantityToRemove = 0;

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
    quantityToRemove = totalDraftOrderQuantity - totalShopifyCartQuantity;
    nonDiscountedQuantityToRemove = nonDiscountedDraftOrderItem
      ? Math.max(
          Math.min(nonDiscountedDraftOrderItem.quantity, quantityToRemove),
          0
        )
      : 0;
    discountedQuantityToRemove = discountedDraftOrderItem
      ? Math.max(
          Math.min(
            discountedDraftOrderItem.quantity,
            quantityToRemove - nonDiscountedQuantityToRemove
          ),
          0
        )
      : 0;

    if (nonDiscountedDraftOrderItem) {
      nonDiscountedDraftOrderItem.quantity -= nonDiscountedQuantityToRemove;
    }

    if (discountedDraftOrderItem) {
      discountedDraftOrderItem.quantity -= discountedQuantityToRemove;

      await updateOfferHits(
        draftOrder,
        discountedDraftOrderItem,
        discountedQuantityToRemove
      );
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
  let discountedLineItemsNotInShopifyCart = [];

  // Ensure draft order line items reflect Shopify cart items.
  await Promise.mapSeries(shopifyCartItems, async (shopifyCartItem) => {
    await updateItemQuantity(draftOrder, shopifyCartItems, shopifyCartItem);
  });

  // Remove line items having zero quantity.
  draftOrder.line_items = draftOrder.line_items.filter(
    (lineItem) => lineItem.quantity > 0
  );

  // Find discounted line items not in the Shopify cart.
  discountedLineItemsNotInShopifyCart = draftOrder.line_items.filter(
    (lineItem) => {
      const hasDiscount = !!lineItem.applied_discount;
      const variantIsInCart = !shopifyCartItems.find(
        (item) => item.shopifyVariantId === lineItem.variant_id
      );

      return hasDiscount && variantIsInCart;
    }
  );

  // Remove draft order items not in the Shopify cart.
  draftOrder.line_items = draftOrder.line_items.filter(
    (lineItem) =>
      !!shopifyCartItems.find(
        (item) => item.shopifyVariantId === lineItem.variant_id
      )
  );

  // Update offer hits to stop tracking removed discounted items.
  await Promise.mapSeries(
    discountedLineItemsNotInShopifyCart,
    async (discountedLineItem) => {
      await updateOfferHits(
        draftOrder,
        discountedLineItem,
        discountedLineItem.quantity
      );
    }
  );

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
