const { flatten, uniq } = require('lodash');
const models = require('..');

const findRandomProducts = async (offer, triggerShopifyProductId = undefined, shopifyCartProductIds = [], pagePath = '') => {
  const [Product, PairedPurchase] = await Promise.all([
    models.get('Product'),
    models.get('PairedPurchase'),
    models.get('Shop')
  ]);

  await offer.execPopulate('shop');

  const { shop, offeredCollections } = offer;
  const { offeredProducts } = offer;
  const maximumOfferedProductQuantity = offer.maximumOfferedProductQuantity || 3;
  const hasOfferedProducts = offeredProducts.length > 0;
  const hasOfferedCollections = offeredCollections.length > 0;
  const pagePathProductHandle = pagePath.match(/^\/products\/([^$]+)/)?.[1];
  let pageProduct;
  let excludedShopifyProductIds = [triggerShopifyProductId].filter(Boolean);

  // Find the product, if any, associated with the current page.
  if (pagePathProductHandle) {
    pageProduct = await Product.findOne({
      shop: shop._id,
      'shopifyProductData.handle': pagePathProductHandle
    });
  }

  if (pageProduct) {
    excludedShopifyProductIds = [pageProduct.shopifyProductId];
  }

  // Intelligently find products if the offer has neither offered products nor offered collections.
  if (!hasOfferedProducts && !hasOfferedCollections) {
    return await PairedPurchase.findPairedProducts(
      shop,
      shopifyCartProductIds,
      maximumOfferedProductQuantity,
      excludedShopifyProductIds
    );
  }

  const offeredShopifyProductIds = offeredProducts.map(({ shopifyProductId }) => shopifyProductId);
  const offeredShopifyVariantIds = uniq(flatten(offeredProducts.map(({ shopifyVariantIds }) => shopifyVariantIds)));
  const offeredShopifyCollectionIds = offeredCollections.map(({ shopifyCollectionId }) => shopifyCollectionId);
  const andCriteria = [];

  // Filter for offered products.
  andCriteria.push({
    $or: [
      { shopifyProductId: { $in: offeredShopifyProductIds } },
      { shopifyCollectionIds: { $in: offeredShopifyCollectionIds } }
    ]
  });

  // Filter for only products that have one or more variants in stock.
  andCriteria.push({
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
    ]
  });

  excludedShopifyProductIds = excludedShopifyProductIds.concat(shopifyCartProductIds);

  const criteria = {
    shop: shop._id,
    $and: andCriteria,
    shopifyProductId: { $nin: excludedShopifyProductIds },
    'shopifyProductData.published_at': { $ne: null }
  };

  // Randomly select a product for the offer OR a product in a collection for the offer.
  let randomProducts = await Product.aggregate([
    { $match: criteria },
    { $sample: { size: maximumOfferedProductQuantity } },
    { $project: { _id: 1 } }
  ]);

  if (!randomProducts?.[0]?._id) {
    return [];
  }

  // Aggregation only returns JSON, so query for Mongoose documents.
  randomProducts = await Promise.all(randomProducts.map(async ({ _id }) => Product.findById(_id)));

  // Filter variants for only those offered.
  if (offeredShopifyVariantIds.length > 0 && offeredCollections.length === 0) {
    randomProducts.forEach((randomProduct) => {
      randomProduct.shopifyProductData.variants = randomProduct.shopifyProductData.variants.filter((variant) =>
        offeredShopifyVariantIds.includes(variant.id)
      );
    });
  }

  return randomProducts;
};

module.exports = findRandomProducts;
