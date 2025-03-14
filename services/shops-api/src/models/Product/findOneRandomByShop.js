const models = require('..');

const findOneRandomByShop = async (shop, options = {}) => {
  const Product = await models.get('Product');
  const { excludedShopifyProductIds = [] } = options;
  const products = await Product.aggregate([
    {
      $match: {
        shop: shop._id,
        shopifyProductId: { $nin: excludedShopifyProductIds },
        $or: [
          {
            'shopifyProductData.variants.inventory_management': {
              $ne: 'shopify'
            }
          },
          {
            'shopifyProductData.variants.inventory_quantity': {
              $gt: 0
            }
          },
          {
            'shopifyProductData.variants.inventory_policy': 'continue'
          }
        ],
        'shopifyProductData.published_at': { $ne: null }
      }
    },
    { $sample: { size: 1 } }
  ]);
  const product = products?.[0];

  return product;
};

module.exports = findOneRandomByShop;
