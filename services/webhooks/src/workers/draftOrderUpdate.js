const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const {
  checkWebhookHmacValidity,
  createRawBody
} = require('shopify-hmac-validation');
const { aws4Interceptor } = require('aws4-axios');
const HttpClient = require('@greatupsells/http-client').default;
const logger = require('@greatupsells/logger');

const {
  AWS_REGION,
  SHOPS_API_URL,
  SHOPIFY_ADMIN_APP_API_SECRET_KEY
} = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

httpClient.addRequestInterceptor(
  aws4Interceptor({
    region: AWS_REGION,
    service: 'execute-api'
  })
);

const processData = async (metadata, data, rawData) => {
  try {
    const hmac = metadata['X-Shopify-Hmac-Sha256'];
    const hmacValid = checkWebhookHmacValidity(
      SHOPIFY_ADMIN_APP_API_SECRET_KEY,
      rawData,
      hmac
    );
    const topic = metadata['X-Shopify-Topic'];

    if (!hmacValid) {
      await logger.warn(`Invalid HMAC for ${topic} webhook`, null, {
        metadata,
        data
      });
    }

    const shopifyDraftOrderData = data;
    const shopifyDraftOrderId = data.id;
    const shopifyOrderId = shopifyDraftOrderData.order_id;

    if (!shopifyOrderId) {
      return;
    }

    // Find all offer hits associated with the draft order.
    const offerHits = await httpClient.get(
      `/offer-hits/shopify-draft-order-id/${shopifyDraftOrderId}`
    );

    // Update each offer hit to reference the order associated wtih the draft order.
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
    await logger.error(
      `Error processing draft order update webhook data`,
      error,
      { metadata, data }
    );
  }
};

const processRecord = async (record) => {
  const body = JSON.parse(record.body);
  const { detail } = body;
  const { payload, metadata, errors } = detail;
  const topic = metadata['X-Shopify-Topic'];

  if (errors) {
    return await logger.error(
      `Error processing ${topic} webhook record`,
      null,
      { errors, record }
    );
  }

  await processData(metadata, payload, createRawBody(payload));
};

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.source === 'serverless-plugin-warmup') {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  if (event.Records) {
    // SQS (production).
    const results = await Promise.allSettled(event.Records.map(processRecord));
    const anyFailed = results.some(({ status }) => status === 'rejected');

    if (anyFailed) {
      throw new Error('Failed to process one or more records');
    }
  } else {
    // HTTP (development).
    await processData(event.headers, JSON.parse(event.body), event.body);

    return {
      statusCode: StatusCodes.OK,
      body: ReasonPhrases.OK
    };
  }
};

module.exports.handler = handler;
