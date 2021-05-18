const logger = require('@neatowebsolutions/upselling-logger');

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
    condition: 'greatappsoffer_DO_NOT_DELETE'
  };

  const smartCollectionRuleExists =
    smartAllCollection &&
    smartAllCollection.rules.find(
      ({ column, relation, condition }) =>
        column === rule.column &&
        relation === rule.relation &&
        condition === rule.condition
    );

  // Add a rule to the existing "all" smart collection if the collection
  // exists and no custom "all" collection exists.
  if (smartAllCollection && !customAllCollection) {
    if (smartCollectionRuleExists) {
      await logger.info(
        `Skipped adding rule to existing smart collection as rule already exists for shop (${shop.toString()})`,
        rule,
        smartAllCollection
      );
      return;
    }

    smartAllCollection = await shopifyApiClient.smartCollection.update(
      smartAllCollection.id,
      {
        ...smartAllCollection,
        rules: [...smartAllCollection.rules, rule]
      }
    );

    await logger.info(
      `Added rule to existing smart collection for shop (${shop.toString()})`,
      rule,
      smartAllCollection
    );
  }

  // Create a smart "all" collection if no "all" collection exists.
  if (!smartAllCollection && !customAllCollection) {
    smartAllCollection = await shopifyApiClient.smartCollection.create({
      title: 'Products',
      handle: 'all',
      published_scope: 'web',
      rules: [rule]
    });

    await logger.info(
      `Created new smart collection for shop (${shop.toString()})`,
      rule,
      smartAllCollection
    );
  }

  if (customAllCollection) {
    await logger.info(
      `No collection changes made for shop as custom "all" collection exists (${shop.toString()})`,
      customAllCollection
    );
  }
};

module.exports = addProductTypeRule;
