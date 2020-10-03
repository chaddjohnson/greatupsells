const trackOriginalProduct = async (offerHit, productId, variantId) => {
  const models = require('..');
  const Product = await models.get('Product');
  const product = await Product.findByShopifyProductId(productId);
  const variant =
    product &&
    product.shopifyProductData &&
    product.shopifyProductData.variants.find(({ id }) => id === variantId);

  if (!product) {
    throw new Error(`Unable to find Shopify product ${productId}`);
  }

  if (!variant) {
    throw new Error(
      `Unable to find Shopify product variant ${variantId} for product (${product.toString()})`
    );
  }

  offerHit.originalShopifyProductId = productId;
  offerHit.originalShopifyProductVariantId = variantId;
  offerHit.originalShopifyProductVariantPrice = parseFloat(variant.price) || 0;
};

module.exports = trackOriginalProduct;
