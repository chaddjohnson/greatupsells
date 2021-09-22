const models = require('..');

const trackAcceptedProduct = async (
  offerHit,
  shopifyProductId,
  shopifyVariantId,
  quantity
) => {
  await offerHit.execPopulate('offer');

  const Product = await models.get('Product');
  const product = await Product.findOneByShopifyProductId(shopifyProductId);
  const { offer } = offerHit;

  // Get a reference to the variant in the Shopify data.
  const variant = product?.shopifyProductData?.variants.find(
    ({ id }) => id === shopifyVariantId
  );

  if (!product) {
    throw new Error(`Unable to find Shopify product ${shopifyProductId}`);
  }

  if (!variant) {
    throw new Error(
      `Unable to find Shopify product variant ${shopifyVariantId} for product (${product.toString()})`
    );
  }

  const originalPrice = parseFloat(variant.price);
  const acceptedPrice = offer.calculateDiscountedPrice(originalPrice);

  // Track the accepted product data for the offer hit.
  offerHit.acceptedProducts = offerHit.acceptedProducts || [];
  offerHit.acceptedProducts.push({
    shopifyProductId,
    shopifyVariantId,
    originalPrice,
    acceptedPrice,
    quantity
  });

  offerHit.acceptedAt = offerHit.acceptedAt || Date.now();

  offerHit.markModified('acceptedProducts');

  await offerHit.save();
};

module.exports = trackAcceptedProduct;
