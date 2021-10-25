const Promise = require('bluebird');
const logger = require('@neatowebsolutions/greatupsells-logger');
const models = require('..');

const importProduct = async (shop, shopifyProductData) => {
  try {
    const Product = await models.get('Product');
    const { shopifyShopId } = shop;
    const shopifyProductId = shopifyProductData.id;
    let product = await Product.findOneByShopifyProductId(
      shopifyProductData.id
    );

    if (product) {
      product.shopifyProductData = shopifyProductData;
    } else {
      product = new Product({
        shop,
        shopifyShopId,
        shopifyProductId,
        shopifyProductData
      });

      await logger.info(
        `Imported product from Shopify (${product.toString()})`,
        { shopifyProductData }
      );
    }

    await product.save();
    await product.trackShopifyCollections();
  } catch (error) {
    await logger.warn(
      `Error importing Shopify product ${
        shopifyProductData.id
      } for shop (${shop.toString()})`,
      error
    );
  }
};

const importProducts = async (shop) => {
  const shopifyApiClient = shop.getShopifyApiClient();
  let params = { limit: 100 };

  // Handle pagination.
  do {
    // eslint-disable-next-line no-await-in-loop
    const shopifyProducts = await shopifyApiClient.product.list(params);

    // eslint-disable-next-line no-await-in-loop
    await Promise.mapSeries(shopifyProducts, async (shopifyProductData) => {
      await importProduct(shop, shopifyProductData);
    });

    params = shopifyProducts.nextPageParameters;
  } while (params);
};

module.exports = importProducts;
