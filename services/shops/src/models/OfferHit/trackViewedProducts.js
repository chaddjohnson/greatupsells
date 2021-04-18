const logger = require('@neatowebsolutions/upselling-logger');
const { compact } = require('lodash');
const mongodbClient = require('../mongodbClient');

const findProducts = async (shopifyProductIds) => {
  const Product = mongodbClient.connection.model('Product');

  return await Promise.all(
    shopifyProductIds.map(async (shopifyProductId) => {
      const product = await Product.findByShopifyProductId(shopifyProductId);

      if (!product) {
        return await logger.error(
          `Unable to find Shopify product ${shopifyProductId}`
        );
      }

      return product;
    })
  );
};

const findVariants = async (products, shopifyVariantIds) => {
  return compact(
    await Promise.all(
      products.map(async (product, productIndex) => {
        if (!product) {
          return;
        }

        const shopifyVariants =
          product.shopifyProductData && product.shopifyProductData.variants;
        const shopifyVariantId = shopifyVariantIds[productIndex];

        const shopifyVariant =
          shopifyVariants &&
          shopifyVariants.find(({ id }) => id === shopifyVariantId);

        if (!shopifyVariant) {
          return await logger.error(
            `Unable to find Shopify product variant ${shopifyVariantId} for product (${product.toString()})`
          );
        }

        return shopifyVariant;
      })
    )
  );
};

const trackViewedProducts = async (
  offerHit,
  shopifyProductIds = [],
  shopifyVariantIds = []
) => {
  const products = await findProducts(shopifyProductIds);
  const variants = await findVariants(products, shopifyVariantIds);
  const variantPrices = variants.map(({ price }) => parseFloat(price) || 0);

  // Track the viewed product data for the offer hit.
  offerHit.viewedShopifyProductIds = shopifyProductIds;
  offerHit.viewedShopifyVariantIds = shopifyVariantIds;
  offerHit.viewedShopifyVariantPrices = variantPrices;

  await offerHit.save();
};

module.exports = trackViewedProducts;
