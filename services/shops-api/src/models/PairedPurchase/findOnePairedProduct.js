const models = require('..');

const findOnePairedProduct = async (shopifyProductId, options = {}) => {
  const [PairedPurchase, Product] = await Promise.all([
    models.get('PairedPurchase'),
    models.get('Product')
  ]);
  const { excludedShopifyProductIds = [] } = options;
  const criteria = {
    frequency: { $gt: 0 },
    shopifyProductId,
    pairedShopifyProductId: { $nin: excludedShopifyProductIds },
    pairedProductHasInventory: true,
    pairedProductIsPublished: true
  };
  const pairedPurchases = await PairedPurchase.aggregate([
    { $match: criteria },
    {
      $set: {
        weight: {
          $multiply: [
            {
              $divide: [
                {
                  $log: [{ $subtract: [1.0, { $rand: {} }] }, 10]
                },
                '$frequency'
              ]
            },
            -1
          ]
        }
      }
    },
    { $project: { pairedShopifyProductId: 1, weight: 1 } },
    { $sort: { weight: 1 } },
    { $sample: { size: 1 } }
  ]);
  const pairedPurchase = pairedPurchases?.[0];
  const pairedPurchaseShopifyProductId = pairedPurchase?.pairedShopifyProductId;

  if (!pairedPurchaseShopifyProductId) {
    return;
  }

  if (pairedPurchaseShopifyProductId) {
    return await Product.findOneByShopifyProductId(
      pairedPurchaseShopifyProductId
    );
  }
};

module.exports = findOnePairedProduct;
