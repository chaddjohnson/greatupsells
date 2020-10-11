const trackOriginalProduct = async (
  offerHit,
  shopifyProductId,
  shopifyVariantId
) => {
  const models = require('..');
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
  offerHit.originalShopifyProductId = shopifyProductId;
  offerHit.originalShopifyVariantId = shopifyVariantId;
  offerHit.originalShopifyVariantPrice = parseFloat(variant.price) || 0;

  await offerHit.save();
};

module.exports = trackOriginalProduct;
