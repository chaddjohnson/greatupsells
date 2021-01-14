const HttpClient = require('@neatowebsolutions/upselling-http-client');
const logger = require('@neatowebsolutions/upselling-logger');

const { SHOPS_API_URL } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

const processRecord = async (record) => {
  try {
    const { detail } = JSON.parse(record.body);
    const { metadata, payload, errors } = detail;

    if (errors) {
      return await logger.error(
        `Error handling product webhook`,
        errors,
        record
      );
    }

    const shopifyProductData = payload.product;
    const shopifyProductId = shopifyProductData.id;
    const domain = metadata['X-Shopify-Shop-Domain'];
    const shop = await httpClient.get(`/shops/domain/${domain}`);
    const { shopifyShopId } = shop;
    const product = await httpClient.get(
      `/products/shopify-product-id/${shopifyProductId}`
    );
    const dataIsNewer =
      !product ||
      !product.shopifyProductData ||
      new Date(shopifyProductData.updated_at) >
        new Date(product.shopifyProductData.updated_at);

    if (!product) {
      await logger.debug(`Creating product via webhook`, record);

      await httpClient.post(`/products`, {
        shop: shop._id,
        shopifyShopId,
        shopifyProductId,
        shopifyProductData
      });
    } else if (dataIsNewer) {
      await logger.debug(`Updating product via webhook`, record);

      product.shopifyProductData = shopifyProductData;

      await httpClient.put(`/products/${product._id}`, product);
    }
  } catch (error) {
    await logger.error(`Error handling product webhook`, error, record);
  }
};

const handler = async (event) => {
  await Promise.all(event.Records.map(processRecord));
};

module.exports = handler;
