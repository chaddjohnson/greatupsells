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
        `Error handling collection deletion webhook`,
        errors,
        record
      );
    }

    const shopifyCollectionData = payload;
    const domain = metadata['X-Shopify-Shop-Domain'];
    const shop = await httpClient.get(`/shops/domain/${domain}`);
    const collection = await httpClient.get(
      `/collections/shopify-collection-id/${shopifyCollectionData.id}`
    );

    if (!collection) {
      return;
    }

    await logger.info(
      `Deleting collection "${collection.title}" for shop ${shop.domain} via webhook`,
      record
    );

    await httpClient.delete(`/collections/${collection._id}`);
  } catch (error) {
    await logger.error(
      `Error handling collection deletion webhook`,
      error,
      record
    );
  }
};

const handler = async (event) => {
  await Promise.all(event.Records.map(processRecord));
};

module.exports = handler;
