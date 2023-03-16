const HttpClient = require('@greatupsells/gateway-http-client');
const logger = require('@greatupsells/logger');
const { getMetadataValue, handle } = require('../lib/worker');

const { SHOPS_API_URL } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

const processor = async (metadata, payload) => {
  try {
    const domain = getMetadataValue(metadata, 'X-Shopify-Shop-Domain');
    const shopifyProductData = payload;
    const shopifyProductId = shopifyProductData.id;
    const shop = await httpClient.get(`/shops/domain/${domain}`);
    const { shopifyShopId } = shop;
    let product = null;
    let dataIsNewer = false;

    try {
      product = await httpClient.get(
        `/products/shopify-product-id/${shopifyProductId}`
      );
      dataIsNewer =
        !product.shopifyProductData ||
        new Date(shopifyProductData.updated_at) >
          new Date(product.shopifyProductData.updated_at);

      if (dataIsNewer) {
        product.shopifyProductData = shopifyProductData;

        await httpClient.put(`/products/${product._id}`, product);
      }
    } catch (error) {
      await httpClient.post(`/products`, {
        shop: shop._id,
        shopifyShopId,
        shopifyProductId,
        shopifyProductData
      });
    }
  } catch (error) {
    await logger.error(`Error processing product webhook data`, error, {
      metadata,
      payload
    });
    throw error;
  }
};

const handler = async (event, context) => {
  return await handle(event, context, processor);
};

module.exports.handler = handler;
