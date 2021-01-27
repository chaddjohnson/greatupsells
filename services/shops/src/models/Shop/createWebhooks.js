const Promise = require('bluebird');
const { StatusCodes } = require('http-status-codes');
const promiseRetry = require('promise-retry');
const logger = require('@neatowebsolutions/upselling-logger');

const { WEBHOOKS_ARN } = process.env;

const definitions = [
  { topic: 'app/uninstalled', address: WEBHOOKS_ARN, format: 'json' },
  { topic: 'collections/create', address: WEBHOOKS_ARN, format: 'json' },
  { topic: 'collections/update', address: WEBHOOKS_ARN, format: 'json' },
  { topic: 'collections/delete', address: WEBHOOKS_ARN, format: 'json' },
  { topic: 'orders/paid', address: WEBHOOKS_ARN, format: 'json' },
  { topic: 'orders/updated', address: WEBHOOKS_ARN, format: 'json' },
  { topic: 'orders/cancelled', address: WEBHOOKS_ARN, format: 'json' },
  { topic: 'products/create', address: WEBHOOKS_ARN, format: 'json' },
  { topic: 'products/update', address: WEBHOOKS_ARN, format: 'json' },
  { topic: 'products/delete', address: WEBHOOKS_ARN, format: 'json' },
  { topic: 'shop/update', address: WEBHOOKS_ARN, format: 'json' }
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
        definition
      );
    } catch (error) {
      await logger.warn(
        `Failed to create Shopify webhook "${
          definition.topic
        }" for shop (${shop.toString()})`,
        error,
        definition
      );
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
        webhook
      );
    } catch (error) {
      const ignoredHttpStatuses = [
        StatusCodes.PAYMENT_REQUIRED,
        StatusCodes.NOT_FOUND,
        StatusCodes.FORBIDDEN
      ];
      const isValidError =
        !error.response ||
        ignoredHttpStatuses.includes(error.response.statusCode);

      if (isValidError) {
        await logger.warn(
          `Failed to update Shopify webhook ${
            definition.topic
          } for shop ${shop.toString()}`,
          error,
          webhook
        );
      }
    }
  }
};

const createWebhooks = async (shop) => {
  const shopifyApiClient = shop.getShopifyApiClient();
  const webhooks = await shopifyApiClient.webhook.list();
  const retryConfig = {
    retries: 5,
    minTimeout: 0.5 * 1000,
    maxTimeout: 2 * 1000
  };

  await Promise.map(definitions, async (definition) => {
    // Sometimes webhook creation fails, so try multiple times.
    await promiseRetry(async (retry) => {
      try {
        await createWebhook(shop, webhooks, definition);
      } catch (error) {
        return retry(error);
      }
    }, retryConfig);
  });
};

module.exports = createWebhooks;
