const logger = require('@neatowebsolutions/logger');

const { SHOPIFY_ADMIN_URL } = process.env;

const createWebhooks = async () => {
  // ...
  // logger.info(`Created webhooks for shop ${shop.domain}`);
};

const addScripts = async (shop) => {
  const src = `${SHOPIFY_ADMIN_URL}/storefront.js`;
  const shopifyApiClient = shop.getShopifyApiClient();
  const scriptTags = await shopifyApiClient.scriptTag.list();
  const existingScriptTag = scriptTags.find(
    (scriptTag) => scriptTag.src === src
  );

  if (!existingScriptTag) {
    await shopifyApiClient.scriptTag.create({
      event: 'onload',
      src,
      display_scope: 'all'
    });

    logger.info(`Added script tag for shop ${shop.domain}`, src);
  }
};

const addProductTypeRule = async (shop) => {
  const shopifyApiClient = shop.getShopifyApiClient();

  // Check if an "all" SmartCollection exists.
  const smartCollections = await shopifyApiClient.smartCollection.list({
    handle: 'all'
  });

  // Check if an "all" custom collection exists.
  const customCollections = await shopifyApiClient.customCollection.list({
    handle: 'all'
  });

  let smartAllCollection = smartCollections[0];
  const customAllCollection = customCollections[0];

  // This rule prevents temporary products this app creates from being visible in the store.
  const rule = {
    column: 'type',
    relation: 'not_equals',
    condition: 'upsellcrosssell'
  };

  if (smartAllCollection) {
    // Add a rule to the existing smart collection.
    smartAllCollection = await shopifyApiClient.smartCollection.update(
      smartAllCollection.id,
      {
        ...smartAllCollection,
        rules: [...smartAllCollection.rules, rule]
      }
    );

    logger.info(
      `Added rule to existing smart collection for shop ${shop.domain}`,
      rule,
      smartAllCollection
    );
  }

  if (!smartAllCollection && !customAllCollection) {
    // No collection exists, so create a smart collection.
    smartAllCollection = await shopifyApiClient.smartCollection.create({
      title: 'Products',
      handle: 'all',
      published_scope: 'web',
      rules: [rule]
    });

    logger.info(
      `Created new smart collection for shop ${shop.domain}`,
      rule,
      smartAllCollection
    );
  }

  if (customAllCollection) {
    logger.info(
      `No collection changes made for shop ${shop.domain} as custom "all" collection exists`,
      customAllCollection
    );
  }
};

const importCollections = async (shop) => {
  // TODO: Enqueue a background worker.
};

const importProducts = async (shop) => {
  // TODO: Enqueue a background worker.
};

module.exports = async (shop) => {
  logger.info(`Initializing shop ${shop.domain}`);

  await createWebhooks(shop);
  await addScripts(shop);
  await addProductTypeRule(shop);
  await importCollections(shop);
  await importProducts(shop);
};
