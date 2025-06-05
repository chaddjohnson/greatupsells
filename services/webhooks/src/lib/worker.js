const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const crypto = require('crypto');
const logger = require('@greatupsells/logger');
const { InvalidHmacError } = require('./errors');

const { SHOPIFY_ADMIN_APP_API_SECRET_KEY } = process.env;

// This works around Shopify's inconsistent metadata key naming across HTTP webhooks and EventBridge subscriptions.
const getMetadataValue = (metadata, searchKey) => {
  return metadata[Object.keys(metadata).find((key) => key.toLowerCase() === searchKey.toLowerCase())];
};

const validate = (hmac, rawBody) => {
  const secret = SHOPIFY_ADMIN_APP_API_SECRET_KEY;
  const buffer = Buffer.from(rawBody).toString('utf8');
  const hash = crypto.createHmac('SHA256', secret).update(buffer).digest('base64');
  const hmacValid = crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hmac));

  return hmacValid;
};

const processRecord = async (record, processor) => {
  const body = JSON.parse(record.body);
  const { detail } = body;
  const { metadata, payload, errors } = detail;
  const topic = getMetadataValue(metadata, 'X-Shopify-Topic');
  const hmac = getMetadataValue(metadata, 'X-Shopify-Hmac-SHA256');
  const hmacValid = validate(hmac, record.body);

  if (!hmacValid) {
    await logger.error(`Invalid HMAC for ${topic} webhook`, null, {
      metadata,
      body
    });
    throw new InvalidHmacError(`Invalid HMAC for ${topic} webhook`);
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

const processRequest = async (headers, rawBody, processor) => {
  const topic = getMetadataValue(headers, 'X-Shopify-Topic');
  const hmac = getMetadataValue(headers, 'X-Shopify-Hmac-SHA256');
  const hmacValid = validate(hmac, rawBody);
  const body = JSON.parse(rawBody);

  if (!hmacValid) {
    await logger.error(`Invalid HMAC for ${topic} webhook`, null, {
      headers,
      body
    });
    throw new InvalidHmacError(`Invalid HMAC for ${topic} webhook`);
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
    // SQS
    const results = await Promise.allSettled(event.Records.map(async (record) => processRecord(record, processor)));
    const anyFailed = results.some(({ status }) => status === 'rejected');
    const error = results.find(({ status }) => status === 'rejected')?.reason;

    if (anyFailed) {
      throw error;
    }
  } else {
    const { headers } = event;

    try {
      // HTTP
      await processRequest(headers, event.body, processor);

      return {
        statusCode: StatusCodes.OK,
        body: ReasonPhrases.OK
      };
    } catch (error) {
      if (error instanceof InvalidHmacError) {
        return {
          statusCode: StatusCodes.UNAUTHORIZED,
          body: error.message
        };
      }

      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
      };
    }
  }
};

module.exports = {
  getMetadataValue,
  handle
};
