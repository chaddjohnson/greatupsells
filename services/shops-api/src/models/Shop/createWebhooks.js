const Promise = require('bluebird');
const { StatusCodes } = require('http-status-codes');
const promiseRetry = require('promise-retry');
const logger = require('@greatupsells/logger');

const { WEBHOOK_ARN, WEBHOOK_API_URL } = process.env;

const definitions = [
  {
    topic: 'app/uninstalled',
    address: WEBHOOK_ARN || `${WEBHOOK_API_URL}/shopify/app-uninstall`,
    format: 'json'
  },
  {
    topic: 'collections/create',
    address: WEBHOOK_ARN || `${WEBHOOK_API_URL}/shopify/collection`,
    format: 'json'
  },
  {
    topic: 'collections/update',
    address: WEBHOOK_ARN || `${WEBHOOK_API_URL}/shopify/collection`,
    format: 'json'
  },
  {
    topic: 'collections/delete',
    address: WEBHOOK_ARN || `${WEBHOOK_API_URL}/shopify/collection-deletion`,
    format: 'json'
  },
  {
    topic: 'orders/create',
    address: WEBHOOK_ARN || `${WEBHOOK_API_URL}/shopify/order-create`,
    format: 'json'
  },
  {
    topic: 'orders/paid',
    address: WEBHOOK_ARN || `${WEBHOOK_API_URL}/shopify/order-paid`,
    format: 'json'
  },
  {
    topic: 'orders/updated',
    address: WEBHOOK_ARN || `${WEBHOOK_API_URL}/shopify/order-update`,
    format: 'json'
  },
  {
    topic: 'orders/cancelled',
    address: WEBHOOK_ARN || `${WEBHOOK_API_URL}/shopify/order-cancelation`,
    format: 'json'
  },
  {
    topic: 'draft_orders/update',
    address: WEBHOOK_ARN || `${WEBHOOK_API_URL}/shopify/draft-order-update`,
    format: 'json'
  },
  {
    topic: 'products/create',
    address: WEBHOOK_ARN || `${WEBHOOK_API_URL}/shopify/product`,
    format: 'json'
  },
  {
    topic: 'products/update',
    address: WEBHOOK_ARN || `${WEBHOOK_API_URL}/shopify/product`,
    format: 'json'
  },
  {
    topic: 'products/delete',
    address: WEBHOOK_ARN || `${WEBHOOK_API_URL}/shopify/product-deletion`,
    format: 'json'
  },
  {
    topic: 'shop/update',
    address: WEBHOOK_ARN || `${WEBHOOK_API_URL}/shopify/shop`,
    format: 'json'
  },
  {
    topic: 'themes/publish',
    address: WEBHOOK_ARN || `${WEBHOOK_API_URL}/shopify/theme-publish`,
    format: 'json'
  }
];

const createWebhook = async (shop, existingWebhooks, definition) => {
  const shopifyApiClient = shop.getShopifyApiClient();
  const webhook = existingWebhooks.find(
    ({ topic }) => topic === definition.topic
  );
  const webhookIsCorrect = webhook && webhook.address === definition.address;

  // Create the webhook if it does not exist.
  if (!webhook) {
    try {
      await shopifyApiClient.webhook.create(definition);
      await logger.info(
        `Created Shopify webhook "${
          definition.topic
        }" for shop (${shop.toString()})`,
        { definition }
      );
    } catch (error) {
      await logger.warn(
        `Failed to create Shopify webhook "${
          definition.topic
        }" for shop (${shop.toString()})`,
        error,
        { definition }
      );

      throw error;
    }
  }

  // Update the webhook if it exists but is incorrect.
  if (webhook && !webhookIsCorrect) {
    // Update the webhook address.
    webhook.address = definition.address;

    // Remove this field to prevent Shopify from complaining.
    delete webhook.api_version;

    try {
      await shopifyApiClient.webhook.update(webhook.id, webhook);
      await logger.info(
        `Updated Shopify webhook "${
          definition.topic
        }" for shop (${shop.toString()})`,
        { webhook }
      );
    } catch (error) {
      const ignoredHttpStatuses = [
        StatusCodes.PAYMENT_REQUIRED,
        StatusCodes.NOT_FOUND,
        StatusCodes.FORBIDDEN,
        StatusCodes.LOCKED
      ];
      const isValidError =
        !error.response ||
        !ignoredHttpStatuses.includes(error.response.statusCode);

      if (!isValidError) {
        return;
      }

      await logger.warn(
        `Failed to update Shopify webhook ${
          definition.topic
        } for shop ${shop.toString()}`,
        error,
        { webhook }
      );

      throw error;
    }
  }
};

const createWebhooks = async (shop) => {
  if (!WEBHOOK_ARN && !WEBHOOK_API_URL) {
    return logger.warn(
      `Skipping webhook creation for shop as webhook address is not set (${shop.toString()})`
    );
  }

  const shopifyApiClient = shop.getShopifyApiClient();
  const webhooks = await shopifyApiClient.webhook.list();
  const retryConfig = {
    retries: 5,
    minTimeout: 0.5 * 1000,
    maxTimeout: 2 * 1000
  };

  await Promise.map(
    definitions,
    async (definition) => {
      // Sometimes webhook creation fails, so try multiple times.
      await promiseRetry(async (retry) => {
        try {
          await createWebhook(shop, webhooks, definition);
        } catch (error) {
          return retry(error);
        }
      }, retryConfig);
    },
    { concurrency: 6 }
  );
};

module.exports = createWebhooks;
