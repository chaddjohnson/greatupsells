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
      return await logger.error(`Error handling shop webhook`, errors, record);
    }

    const shopifyShopData = payload.shop;
    const domain = metadata['X-Shopify-Shop-Domain'];
    const shop = await httpClient.get(`/shops/domain/${domain}`);

    await logger.info(`Updating shop ${shop.domain} via webhook`, record);

    shop.shopifyShopData = shopifyShopData;

    await httpClient.put(`/shops/${shop._id}`);
  } catch (error) {
    await logger.error(`Error updating shop via webhook`, error, record);
  }
};

const handler = async (event) => {
  await Promise.all(event.Records.map(processRecord));
};

module.exports = handler;
