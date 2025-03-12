const Promise = require('bluebird');
const logger = require('@greatupsells/logger');
const models = require('..');
const enqueueOrderImport = require('./enqueueOrderImport');

const importProduct = async (shop, shopifyProductData) => {
  try {
    const Product = await models.get('Product');
    const { shopifyShopId } = shop;
    const shopifyProductId = shopifyProductData.id;
    let product = await Product.findOneByShopifyProductId(shopifyProductData.id);

    if (product) {
      product.shopifyProductData = shopifyProductData;
    } else {
      product = new Product({
        shop,
        shopifyShopId,
        shopifyProductId,
        shopifyProductData
      });

      await logger.info(`Imported product from Shopify (${product.toString()})`, { shopifyProductData });
    }

    product.variants = await product.buildVariants(product);
    product.markModified('variants');

    await product.save();
    await product.trackShopifyCollections();
  } catch (error) {
    await logger.warn(`Error importing Shopify product ${shopifyProductData.id} for shop (${shop.toString()})`, error);
  }
};

const importProducts = async (shop) => {
  const shopifyApiClient = shop.getShopifyApiClient();
  let params = { limit: 100 };

  // Handle pagination.
  do {
    const shopifyProducts = await shopifyApiClient.product.list(params);

    await Promise.map(
      shopifyProducts,
      async (shopifyProductData) => {
        await importProduct(shop, shopifyProductData);
      },
      { concurrency: 10 }
    );

    params = shopifyProducts.nextPageParameters;
  } while (params);

  // Import orders after importing products as orders depend on products.
  await enqueueOrderImport(shop);

  // Create sample offers after importing products as sample offers depend on products.
  try {
    await shop.createSampleOffers();
  } catch (error) {
    logger.error(`Failed to create sample offers for shop (${shop.toString()})`, error);
  }
};

module.exports = importProducts;
