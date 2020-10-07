const trackOriginalProduct = async (
  offerHit,
  shopifyProductId,
  shopifyVariantId
) => {
  const models = require('..');
  const OfferHit = await models.get('OfferHit');
  const Product = await models.get('Product');
  const product = await Product.findByShopifyProductId(shopifyProductId);
  const variant =
    product &&
    product.shopifyProductData &&
    product.shopifyProductData.variants.find(
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

  // Track the original product data for the offer hit.
  // Use one round trip to prevent write conflicts.
  return OfferHit.findByIdAndUpdate(offerHit.id, {
    originalShopifyProductId: shopifyProductId,
    originalShopifyVariantId: shopifyVariantId,
    originalShopifyVariantPrice: parseFloat(variant.price) || 0
  });
};

module.exports = trackOriginalProduct;
