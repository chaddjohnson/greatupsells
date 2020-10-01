const models = require('..');

const findShopifyProductVariant = async (
  shopifyProductId,
  shopifyProductVariantId
) => {
  const Product = await models.get('Product');
  const product = await Product.findByShopifyProductId(shopifyProductId);
  const { shop } = product;
  const shopifyApiClient = shop.getShopifyApiClient();
  const productHasVariants =
    product &&
    product.shopifyProductData &&
    product.shopifyProductData.variants;
  let variant = null;

  // Find the variant in the local Shopify product data.
  if (productHasVariants) {
    variant = product.shopifyProductData.variants.find(
      ({ id }) => id === shopifyProductVariantId
    );
  }

  // If the variant was not found, look it up in Shopify.
  if (!variant) {
    variant = await shopifyApiClient.productVariant.get(
      shopifyProductVariantId
    );
  }

  return variant;
};

module.exports = findShopifyProductVariant;
