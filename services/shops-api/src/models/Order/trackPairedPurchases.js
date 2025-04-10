const Promise = require('bluebird');
const { flatten } = require('lodash');
const models = require('..');

const trackPairedPurchase = async (order, shopifyProductId, pairedShopifyProductId) => {
  const [PairedPurchase, Product] = await Promise.all([
    models.get('PairedPurchase'),
    models.get('Product'),
    order.execPopulate('shop')
  ]);
  const { shop } = order;
  const { shopifyShopId } = shop;

  // Do not pair an item with itself.
  if (shopifyProductId === pairedShopifyProductId) {
    return;
  }

  // Check for existing paired purchase (and mirror).
  let [
    pairedPurchase1,
    product1, // eslint-disable-line prefer-const
    pairedPurchase2,
    product2 // eslint-disable-line prefer-const
  ] = await Promise.all([
    PairedPurchase.findOne({ shopifyProductId, pairedShopifyProductId }),
    Product.findOneByShopifyProductId(pairedShopifyProductId),
    PairedPurchase.findOne({
      shopifyProductId: pairedShopifyProductId,
      pairedShopifyProductId: shopifyProductId
    }),
    Product.findOneByShopifyProductId(shopifyProductId)
  ]);

  // Create paired purchases if they don't exist.
  [pairedPurchase1, pairedPurchase2] = await Promise.all([
    !pairedPurchase1
      ? PairedPurchase.create({
          shop,
          shopifyShopId,
          shopifyProductId,
          pairedShopifyProductId,
          pairedProduct: product1._id,
          pairedProductHasInventory: product1.hasInventory,
          pairedProductIsPublished: product1.isPublished
        })
      : Promise.resolve(pairedPurchase1),
    !pairedPurchase2
      ? PairedPurchase.create({
          shop,
          shopifyShopId,
          shopifyProductId: pairedShopifyProductId,
          pairedShopifyProductId: shopifyProductId,
          pairedProduct: product2._id,
          pairedProductHasInventory: product2.hasInventory,
          pairedProductIsPublished: product2.isPublished
        })
      : Promise.resolve(pairedPurchase2)
  ]);

  await Promise.all([
    PairedPurchase.findByIdAndUpdate(pairedPurchase1.id, {
      // Increment frequency.
      $inc: { frequency: 1 },

      // Update tracked inventoryand published statuses.
      pairedProductHasInventory: product1.hasInventory,
      pairedProductIsPublished: product1.isPublished
    }),
    PairedPurchase.findByIdAndUpdate(pairedPurchase2.id, {
      // Increment frequency.
      $inc: { frequency: 1 },

      // Update tracked inventoryand published statuses.
      pairedProductHasInventory: product2.hasInventory,
      pairedProductIsPublished: product2.isPublished
    })
  ]);
};

const trackPairedPurchases = async (order) => {
  const lineItems = order.shopifyOrderData.line_items;

  if (lineItems.length < 2) {
    return;
  }

  const lineItemPairs = flatten(
    lineItems.map((lineItem1, index1) =>
      lineItems.slice(index1).map((lineItem2) => [lineItem1.product_id, lineItem2.product_id])
    )
  );

  // Track line item product pairings.
  await Promise.mapSeries(lineItemPairs, async ([shopifyProductId, pairedShopifyProductId]) => {
    if (shopifyProductId && pairedShopifyProductId) {
      await trackPairedPurchase(order, shopifyProductId, pairedShopifyProductId);
    }
  });
};

module.exports = trackPairedPurchases;
