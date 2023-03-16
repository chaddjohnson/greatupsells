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
    const shopifyThemeData = payload;
    const shopifyThemeId = shopifyThemeData.id;
    const shop = await httpClient.get(`/shops/domain/${domain}`);

    await logger.info(
      `Theme "${shopifyThemeData.name}" (${shopifyThemeData.id}) published for shop ${shop.domain}`,
      { metadata, payload }
    );

    await httpClient.post(`/shops/${shop._id}/theme-compatibility`);
    await httpClient.post(
      `/shops/${shop._id}/themes/${shopifyThemeId}/app-embed-block-install`
    );
  } catch (error) {
    await logger.error(`Error processing theme publish webhook data`, error, {
      metadata,
      payload
    });
  }
};

const handler = async (event, context) => {
  return await handle(event, context, processor);
};

module.exports.handler = handler;
