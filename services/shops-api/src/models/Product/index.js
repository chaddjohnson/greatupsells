const mongoose = require('mongoose');
const mongodbClient = require('../mongodbClient');
const findOneRandomByShop = require('./findOneRandomByShop');
const trackShopifyCollections = require('./trackShopifyCollections');
const updateDependentOffers = require('./updateDependentOffers');
const updatePairedPurchases = require('./updatePairedPurchases');
const toString = require('./toString');
const hooks = require('./hooks');

let Product = null;

const schemaOptions = {
  timestamps: true
};
const schema = new mongoose.Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    shopifyShopId: { type: Number, required: true },
    shopifyProductId: { type: Number, required: true },
    shopifyProductData: { type: mongoose.Schema.Types.Mixed, required: true },
    shopifyCollectionIds: [{ type: Number, required: true }],
    title: { type: String, required: true }
  },
  schemaOptions
);

schema.statics.findOneByShopifyProductId = function (shopifyProductId) {
  return Product.findOne({ shopifyProductId: parseInt(shopifyProductId) });
};

schema.statics.findOneByShopifyVariantId = function (shopifyVariantId) {
  return Product.findOne({
    'shopifyProductData.variants.id': parseInt(shopifyVariantId)
  });
};

schema.statics.findOneRandomByShop = function (shop, options) {
  return findOneRandomByShop(shop, options);
};

schema.virtual('hasInventory').get(function () {
  const { shopifyProductData } = this;
  const { variants } = shopifyProductData;
  const anyVariantsHaveInventory = variants.some((variant) => {
    const inventoryManagedByThirdParty =
      variant.inventory_management !== 'shopify';
    const hasNonZeroInventory = variant.inventory_quantity > 0;
    const continueSellingWhenOutOfStock =
      variant.inventory_policy === 'continue';

    return (
      inventoryManagedByThirdParty ||
      hasNonZeroInventory ||
      continueSellingWhenOutOfStock
    );
  });

  return anyVariantsHaveInventory;
});

schema.virtual('isPublished').get(function () {
  const { shopifyProductData } = this;

  return shopifyProductData.published_at !== null;
});

schema.methods.trackShopifyCollections = function () {
  return trackShopifyCollections(this);
};

schema.methods.updateDependentOffers = function () {
  return updateDependentOffers(this);
};

schema.methods.updatePairedPurchases = function () {
  return updatePairedPurchases(this);
};

schema.methods.toString = function () {
  return toString(this);
};

schema.pre('validate', function (next) {
  hooks.preValidate(this, next);
});

schema.index({ shop: 1 });
schema.index({ shopifyShopId: 1 });
schema.index({ shopifyProductId: 1 }, { unique: true });
schema.index({ shopifyCollectionIds: 1 });
schema.index({ 'shopifyProductData.handle': 1 });
schema.index({ 'shopifyProductData.variants.id': 1 });

Product = mongodbClient.connection.model('Product', schema);

module.exports = Product;
