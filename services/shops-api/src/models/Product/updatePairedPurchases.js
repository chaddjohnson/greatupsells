const models = require('..');

const updatePairedPurchase = async (pairedPurchase) => {
  const PairedPurchase = await models.get('PairedPurchase');
  const { pairedProduct } = pairedPurchase;

  await PairedPurchase.findByIdAndUpdate(pairedPurchase.id, {
    // Update tracked inventory status.
    pairedProductHasInventory: pairedProduct.hasInventory,

    // Update tracked published status.
    pairedProductIsPublished: pairedProduct.isPublished
  });
};

const updatePairedPurchases = async (product) => {
  const PairedPurchase = await models.get('PairedPurchase');
  const { shopifyProductId } = product;
  const pairedPurchases = await PairedPurchase.find({
    pairedShopifyProductId: shopifyProductId
  }).populate('pairedProduct');

  await Promise.all(pairedPurchases.map(updatePairedPurchase));
};

module.exports = updatePairedPurchases;
