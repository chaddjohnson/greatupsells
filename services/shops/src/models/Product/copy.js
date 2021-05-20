const { omit, maxBy } = require('lodash');

const { COPIED_PRODUCT_IDENTIFIER } = process.env;

const copyShopifyProductData = (shopifyProductData, variant) => {
  const newShopifyProductData = { ...shopifyProductData };

  // Remove identifiers and dates from the product.
  delete newShopifyProductData.id;
  delete newShopifyProductData.created_at;
  delete newShopifyProductData.updated_at;
  delete newShopifyProductData.admin_graphql_api_id;

  // Keep only the one variant.
  newShopifyProductData.variants = newShopifyProductData.variants.filter(
    ({ id }) => id === variant.id
  );

  // Remove identifiers and dates from the variant.
  delete newShopifyProductData.variants[0].id;
  delete newShopifyProductData.variants[0].product_id;
  delete newShopifyProductData.variants[0].created_at;
  delete newShopifyProductData.variants[0].updated_at;
  delete newShopifyProductData.variants[0].inventory_item_id;
  delete newShopifyProductData.variants[0].inventory_quantity;
  delete newShopifyProductData.variants[0].inventory_quantity_adjustment;
  delete newShopifyProductData.variants[0].old_inventory_quantity;
  delete newShopifyProductData.variants[0].admin_graphql_api_id;

  newShopifyProductData.variants[0].inventory_management = 'shopify';

  // Remove idenfiers from options.
  newShopifyProductData.options.forEach((option) => {
    delete option.id;
    delete option.product_id;
  });

  // Include only standalone images or those associated with the variant.
  newShopifyProductData.images = newShopifyProductData.images.filter(
    (image) =>
      image.variant_ids.length === 0 ||
      image.variant_ids.includes(newShopifyProductData.variants[0].id)
  );

  // Remove identifiers and dates from the images.
  newShopifyProductData.images.forEach((image) => {
    delete image.id;
    delete image.product_id;
    delete image.created_at;
    delete image.updated_at;
    delete image.variant_ids;
  });

  // Remove identifiers and dates from the main image.
  if (newShopifyProductData.image) {
    delete newShopifyProductData.image.id;
    delete newShopifyProductData.image.product_id;
    delete newShopifyProductData.image.created_at;
    delete newShopifyProductData.image.updated_at;
    delete newShopifyProductData.image.variant_ids;
  }

  // Use a special type identifier to ensure this product is not displayed in the live store.
  newShopifyProductData.product_type = COPIED_PRODUCT_IDENTIFIER;

  // Make it clear this is a copy.
  newShopifyProductData.title = `${newShopifyProductData.title} (discounted)`;

  return newShopifyProductData;
};

const setVariantInventory = async (product, quantity) => {
  const { shop, shopifyProductData } = product;
  const shopifyApiClient = shop.getShopifyApiClient();

  const productVariant = shopifyProductData.variants[0];
  const inventoryLevels = await shopifyApiClient.inventoryLevel.list({
    inventory_item_ids: `${productVariant.inventory_item_id}`
  });
  const topInventoryLevel = maxBy(
    inventoryLevels,
    ({ available }) => available
  );

  // Set inventory level availability for the top inventory level to `quantity`.
  await shopifyApiClient.inventoryLevel.set({
    inventory_item_id: topInventoryLevel.inventory_item_id,
    location_id: topInventoryLevel.location_id,
    available: quantity,
    disconnect_if_necessary: true // Set all other inventory level availabilities to 0.
  });
};

const copy = async (
  product,
  shopifyProductDataOverrides,
  variant,
  quantity = 1
) => {
  await product.execPopulate('shop');

  const Product = product.constructor;
  const { shop, shopifyShopId, shopifyProductData } = product;
  const shopifyApiClient = shop.getShopifyApiClient();
  const session = product.$session();

  // Create a clean copy of the product data.
  const newShopifyProductData = copyShopifyProductData(
    { ...shopifyProductData, ...shopifyProductDataOverrides },
    variant
  );

  // Create the product in Shopify, and honor overrides.
  const copiedShopifyProductData = await shopifyApiClient.product.create(
    newShopifyProductData
  );

  // Save a copy of the product locally instead of relying solely on webhooks in
  // case the product is needed before the webhook is triggered.
  const [copiedProduct] = await Product.create(
    [
      {
        shop,
        shopifyShopId,
        shopifyProductId: copiedShopifyProductData.id,
        shopifyProductData: copiedShopifyProductData,
        originalShopifyProductId: product.shopifyProductId
      }
    ],
    { session }
  );

  // Set inventory levels for the variant so that the customer may only buy a
  // limited quantity.
  await setVariantInventory(copiedProduct, quantity);

  // Set metafields such that the product will not be indexable by search engines.
  await shopifyApiClient.metafield.create({
    owner_id: copiedShopifyProductData.id,
    owner_resource: 'product',
    namespace: 'seo',
    key: 'hidden',
    value: 1,
    value_type: 'integer'
  });

  // Prevent selling when out of stock. Wait to update the product until after
  // the client has an opportunity to add the product to the cart. Without this
  // delay, Shopify will say the product is out of stock (probably because
  // inventory levels haven't finished adjusting).
  setTimeout(async () => {
    await shopifyApiClient.productVariant.update(
      copiedShopifyProductData.variants[0].id,
      {
        ...omit(copiedShopifyProductData.variants[0], [
          'inventory_quantity',
          'inventory_quantity_adjustment',
          'old_inventory_quantity'
        ]),
        inventory_policy: 'deny'
      }
    );
  }, 1.5 * 1000);

  return copiedProduct;
};

module.exports = copy;
