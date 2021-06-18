const mongodbClient = require('../mongodbClient');

const buildDraftOrderLineItem = async ({
  offerId,
  shopifyVariantId,
  quantity
}) => {
  const Product = mongodbClient.connection.model('Product');
  const Offer = mongodbClient.connection.model('Offer');

  // Find the offer if one is referenced.
  const offer = offerId && (await Offer.findById(offerId));

  // Find the variant and its price.
  const product = await Product.findOneByShopifyVariantId(shopifyVariantId);
  const variant = product.shopifyProductData.variants.find(
    ({ id }) => id === shopifyVariantId
  );
  const price = parseFloat(variant.price);

  // Build the base line item.
  const lineItem = {
    variant_id: shopifyVariantId,
    quantity,
    price
  };

  // Apply a discount if there is a discount type offer.
  // Amount is rounded. Reference: https://stackoverflow.com/a/11832950/83897.
  if (offer && offer.discountType === 'PERCENTAGE') {
    lineItem.applied_discount = {
      title: offer.discountTitle || 'Discount',
      value: offer.discountAmount,
      value_type: 'percentage',
      amount:
        Math.round(
          (price * quantity * offer.discountAmount + Number.EPSILON) * 100
        ) / 100
    };
  } else if (offer && offer.discountType === 'USD') {
    lineItem.applied_discount = {
      title: offer.discountTitle || 'Discount',
      value: offer.discountAmount,
      value_type: 'fixed_amount',
      amount:
        Math.round((quantity * offer.discountAmount + Number.EPSILON) * 100) /
        100
    };
  } else if (offer && offer.discountType === 'SET_PRICE') {
    lineItem.applied_discount = {
      title: offer.discountTitle || 'Discount',
      value: price - offer.discountAmount,
      value_type: 'fixed_amount',
      amount:
        Math.round(
          ((price - offer.discountAmount) * quantity + Number.EPSILON) * 100
        ) / 100
    };
  }

  return lineItem;
};

module.exports = buildDraftOrderLineItem;
