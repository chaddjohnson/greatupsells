const HttpClient = require('@greatupsells/gateway-http-client');
const logger = require('@greatupsells/logger');
const { getMetadataValue, handle } = require('../lib/worker');

const { SHOPS_API_URL } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

const processor = async (metadata, payload) => {
  let product = null;

  try {
    const topic = getMetadataValue(metadata, 'X-Shopify-Topic');
    const shopifyProductData = payload;
    const shopifyProductId = shopifyProductData.id;

    product = await httpClient.get(`/products/shopify-product-id/${shopifyProductId}`);

    await logger.info(`Deleting product ${product.title} via ${topic} webhook`, { metadata, payload });

    await httpClient.delete(`/products/${product._id}`);
  } catch (error) {
    if (!product) {
      return;
    }

    await logger.error(`Error processing product deletion webhook data`, error, { metadata, payload });
  }
};

const handler = async (event, context) => {
  return await handle(event, context, processor);
};

module.exports.handler = handler;
