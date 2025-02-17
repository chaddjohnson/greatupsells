const HttpClient = require('@greatupsells/gateway-http-client');
const logger = require('@greatupsells/logger');
const { handle } = require('../lib/worker');

const { SHOPS_API_URL } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

const processor = async (metadata, payload) => {
  try {
    const shopifyDraftOrderData = payload;
    const shopifyDraftOrderId = payload.id;
    const shopifyOrderId = shopifyDraftOrderData.order_id;

    if (!shopifyOrderId) {
      return;
    }

    // Find all offer hits associated with the draft order.
    const offerHits = await httpClient.get(`/offer-hits/shopify-draft-order-id/${shopifyDraftOrderId}`);

    // Update each offer hit to reference the order associated with the draft order.
    await Promise.all(
      offerHits.map(async (offerHit) => {
        await httpClient.put(`/offer-hits/${offerHit._id}`, {
          ...offerHit,
          shopifyOrderId
        });
      })
    );

    await logger.info(
      `Associated offer hits for Shopify draft order ${shopifyDraftOrderId} to reference Shopify order ${shopifyOrderId}`
    );
  } catch (error) {
    await logger.error(`Error processing draft order update webhook data`, error, { metadata, payload });
  }
};

const handler = async (event, context) => {
  return await handle(event, context, processor);
};

module.exports.handler = handler;
