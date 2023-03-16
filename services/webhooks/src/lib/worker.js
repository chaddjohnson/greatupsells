const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const {
  checkWebhookHmacValidity,
  createRawBody
} = require('shopify-hmac-validation');
const logger = require('@greatupsells/logger');

const { SHOPIFY_ADMIN_APP_API_SECRET_KEY } = process.env;

// This works around Shopify's inconsistent metadata key naming across HTTP webhooks and EventBridge subscriptions.
const getMetadataValue = (metadata, searchKey) => {
  return metadata[
    Object.keys(metadata).find(
      (key) => key.toLowerCase() === searchKey.toLowerCase()
    )
  ];
};

const validate = async (metadata, data) => {
  const rawBody = createRawBody(data);
  const hmac = getMetadataValue(metadata, 'X-Shopify-Hmac-SHA256');
  const hmacValid = checkWebhookHmacValidity(
    SHOPIFY_ADMIN_APP_API_SECRET_KEY,
    rawBody,
    hmac
  );

  return hmacValid;
};

const processRecord = async (record, processor) => {
  const body = JSON.parse(record.body);
  const { detail } = body;
  const { metadata, payload, errors } = detail;
  const topic = getMetadataValue(metadata, 'X-Shopify-Topic');

  try {
    validate(metadata, record);
  } catch (error) {
    await logger.error(`Invalid HMAC for ${topic} webhook`, null, {
      metadata,
      body
    });
    throw new Error(`Invalid HMAC for ${topic} webhook`);
  }

  if (errors) {
    await logger.error(`Error processing ${topic} webhook record`, null, {
      errors,
      record
    });
    throw new Error(`Error processing ${topic} webhook record`);
  }

  await processor(metadata, payload);
};

const processRequest = async (headers, body, processor) => {
  const topic = getMetadataValue(headers, 'X-Shopify-Topic');

  try {
    validate(headers, body);
  } catch (error) {
    await logger.error(`Invalid HMAC for ${topic} webhook`, null, {
      headers,
      body
    });
    throw new Error(`Invalid HMAC for ${topic} webhook`);
  }

  await processor(headers, body);
};

const handle = async (event, context, processor) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.source === 'serverless-plugin-warmup') {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  if (event.Records) {
    // SQS (production).
    const results = await Promise.allSettled(
      event.Records.map(async (record) => processRecord(record, processor))
    );
    const anyFailed = results.some(({ status }) => status === 'rejected');
    const error = results.find(({ status }) => status === 'rejected')?.reason;

    if (anyFailed) {
      throw error;
    }
  } else {
    const { headers } = event;
    const body = JSON.parse(event.body);

    // HTTP (development).
    await processRequest(headers, body, processor);

    return {
      statusCode: StatusCodes.OK,
      body: ReasonPhrases.OK
    };
  }
};

module.exports = {
  getMetadataValue,
  handle
};
