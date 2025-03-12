const Promise = require('bluebird');

const buildVariants = async (product) => {
  await product.execPopulate('shop');

  const { shop, shopifyProductData } = product;
  const shopifyVariants = shopifyProductData.variants;
  const shopifyApiClient = shop.getShopifyApiClient();

  // Fetch inventory items for each variant to determine if inventory is tracked for each.
  const variants = await Promise.map(
    shopifyVariants,
    async (shopifyVariant) => {
      const inventoryItem = await shopifyApiClient.inventoryItem.get(shopifyVariant.inventory_item_id);
      const { tracked } = inventoryItem;

      return {
        id: shopifyVariant.id,
        inventoryTracked: tracked
      };
    },
    { concurrency: 10 }
  );

  return variants;
};

module.exports = buildVariants;
