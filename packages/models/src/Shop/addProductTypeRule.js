const logger = require('@neatowebsolutions/logger');

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
      `Added rule to existing smart collection for shop (${shop.toString()})`,
      rule,
      smartAllCollection
    );
  }

  if (!smartAllCollection && !customAllCollection) {
    // No collection exists, so create a smart collection.
    smartAllCollection = await shopifyApiClient.smartCollection.create({
      title: 'Products (DO NOT DELETE)',
      handle: 'all',
      published_scope: 'web',
      rules: [rule]
    });

    logger.info(
      `Created new smart collection for shop (${shop.toString()})`,
      rule,
      smartAllCollection
    );
  }

  if (customAllCollection) {
    logger.info(
      `No collection changes made for shop as custom "all" collection exists (${shop.toString()})`,
      customAllCollection
    );
  }
};

module.exports = addProductTypeRule;
