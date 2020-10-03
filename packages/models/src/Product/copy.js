const models = require('..');

const copyShopifyProductData = (shopifyProductData) => {
  const newShopifyProductData = { ...shopifyProductData };

  // Remove identifiers used by the original product.
  delete newShopifyProductData.id;
  delete newShopifyProductData.created_at;
  delete newShopifyProductData.updated_at;
  delete newShopifyProductData.admin_graphql_api_id;

  newShopifyProductData.variants.forEach((variant) => {
    delete variant.id;
    delete variant.product_id;
    delete variant.created_at;
    delete variant.updated_at;
    delete variant.inventory_item_id;
    delete variant.admin_graphql_api_id;
  });

  newShopifyProductData.options.forEach((option) => {
    delete option.id;
    delete option.product_id;
  });

  newShopifyProductData.images.forEach((image) => {
    delete image.id;
    delete image.product_id;
    delete image.created_at;
    delete image.updated_at;
    delete image.variant_ids;
  });

  if (newShopifyProductData.image) {
    delete newShopifyProductData.image.id;
    delete newShopifyProductData.image.product_id;
    delete newShopifyProductData.image.created_at;
    delete newShopifyProductData.image.updated_at;
    delete newShopifyProductData.image.variant_ids;
  }

  // Use a special type identifier to ensure this product is not displayed in the live store.
  newShopifyProductData.product_type = 'upsellcrosssell';

  // Make it clear this is a copy.
  newShopifyProductData.title = `${newShopifyProductData.title} (discounted)`;

  return newShopifyProductData;
};

const copy = async (product, shopifyProductDataOverrides = {}) => {
  const Product = await models.get('Product');
  const Shop = await models.get('Shop');
  const shop = await Shop.findById(product.shop);
  const { shopifyShopId, shopifyProductData } = product;
  const shopifyApiClient = shop.getShopifyApiClient();

  // Create a clean copy of the product data.
  const newShopifyProductData = copyShopifyProductData({
    ...shopifyProductData,
    ...shopifyProductDataOverrides
  });

  // Create the product in Shopify, and honor overrides.
  const copiedShopifyProductData = await shopifyApiClient.product.create(
    newShopifyProductData
  );

  // Save a copy of the product locally instead of relying solely on webhooks in
  // case the product is needed before the webhook is triggered.
  const copiedProduct = await Product.create({
    shop,
    shopifyShopId,
    shopifyProductId: copiedShopifyProductData.id,
    shopifyProductData: copiedShopifyProductData
  });

  // Set metafields such that the product will not be indexable by search engines.
  await shopifyApiClient.metafield.create({
    owner_id: copiedShopifyProductData.id,
    owner_resource: 'product',
    namespace: 'seo',
    key: 'hidden',
    value: 1,
    value_type: 'integer'
  });

  return copiedProduct;
};

module.exports = copy;
