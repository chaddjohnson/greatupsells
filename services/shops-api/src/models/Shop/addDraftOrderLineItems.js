const Promise = require('bluebird');
const models = require('..');
const buildDraftOrderLineItem = require('./buildDraftOrderLineItem');

const findDraftOrderLineItem = async (draftOrder, item) => {
  const Offer = await models.get('Offer');
  const { offerId, shopifyVariantId } = item;

  // Only discounted items will be added, so the item should have an offer ID.
  // But just in case...
  if (!offerId) {
    return;
  }

  const offer = await Offer.findById(offerId);
  const discountTypeMap = {
    PERCENTAGE: 'percentage',
    AMOUNT: 'fixed_amount',
    SET_PRICE: 'fixed_amount'
  };

  const lineItem = draftOrder.line_items.find((current) => {
    const variantMatches = current.variant_id === shopifyVariantId;
    const lineItemHasDiscount = !!current.applied_discount;
    const discountValueMap = {
      PERCENTAGE: offer.discountValue * 100,
      AMOUNT: offer.discountValue,
      SET_PRICE: parseFloat(current.price) - offer.discountValue
    };
    const discountTypeMatches =
      current.applied_discount?.value_type ===
      discountTypeMap[offer.discountType];
    const discountValueMatches =
      parseFloat(current.applied_discount?.value) ===
      discountValueMap[offer.discountType];

    return (
      variantMatches &&
      lineItemHasDiscount &&
      discountTypeMatches &&
      discountValueMatches
    );
  });

  return lineItem;
};

const addDraftOrderLineItems = async (shop, draftOrderId, items) => {
  const shopifyApiClient = shop.getShopifyApiClient();

  // Retrieve the draft order data directly from Shopify.
  let draftOrder = await shopifyApiClient.draftOrder.get(draftOrderId);

  // Handle each item, in order.
  await Promise.mapSeries(items, async (item) => {
    const { offerId, shopifyVariantId } = item;
    const quantity = parseInt(item.quantity);
    const lineItem = await findDraftOrderLineItem(draftOrder, item);

    if (lineItem) {
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
  });

  // Save the updated draft order directly with Shopify.
  draftOrder = await shopifyApiClient.draftOrder.update(
    draftOrderId,
    draftOrder
  );

  return draftOrder;
};

module.exports = addDraftOrderLineItems;
