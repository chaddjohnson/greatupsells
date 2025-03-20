const Promise = require('bluebird');
const { chunk } = require('lodash');

const buildVariants = async (product) => {
  await product.execPopulate('shop');

  const { shop, shopifyProductData } = product;
  const shopifyVariants = shopifyProductData.variants;
  const shopifyApiClient = shop.getShopifyApiClient();
  const shopifyVariantChunks = chunk(shopifyVariants, 100);
  let variants = [];

  // Fetch inventory items in bulk for all variant to determine if inventory is tracked for each.
  await Promise.mapSeries(shopifyVariantChunks, async (shopifyVariantChunk) => {
    const inventoryItemIds = shopifyVariantChunk.map((item) => item.inventory_item_id);
    const inventoryItems = await shopifyApiClient.inventoryItem.list({ ids: inventoryItemIds.join(',') });

    variants = variants.concat(
      inventoryItems.map((inventoryItem, index) => ({
        id: shopifyVariantChunk[index].id,
        inventoryTracked: inventoryItem.tracked
      }))
    );
  });

  return variants;
};

module.exports = buildVariants;
