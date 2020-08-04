const mongoose = require('mongoose');
const mongodbClientFactory = require('@chaddjohnson/mongodb-client-lambda')
  .factory;
const logger = require('@neatowebsolutions/logger');

const mongodbClient = mongodbClientFactory.get(process.env.MONGODB_URI);

let Offer = null;

const offerProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: {
    src: { type: String, required: false }
  },
  shopifyProductId: { type: Number, required: true }
});

const offerCollectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: {
    src: { type: String, required: false }
  },
  shopifyCollectionId: { type: Number, required: true }
});

const schema = new mongoose.Schema(
  {
    shopifyShopId: { type: String, required: true },
    name: { type: String, required: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
    strategy: { type: String, required: true, enum: ['UPSELL', 'CROSS_SELL'] },
    viewCount: { type: Number, required: true, default: 0 },
    acceptanceCount: { type: Number, required: true, default: 0 },
    conversionCount: { type: Number, required: true, default: 0 },
    conversionRate: { type: Number, required: true, default: 0 },
    revenueIncrease: { type: Number, required: true, default: 0 },
    callToActionText: { type: String, required: true },
    successMessageText: { type: String, required: true },
    actionButtonText: { type: String, required: true },
    cancelButtonText: { type: String, required: true },
    actionButtonBehavior: {
      type: String,
      enum: ['CART', 'CHECKOUT', 'PAGE'],
      required: true
    },
    popupThemeType: {
      type: String,
      enum: ['TEMPLATE', 'CUSTOM'],
      required: true
    },
    popupThemeTemplateId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false
    },
    popupTheme: {
      callToActionTextColor: { type: String, required: true },
      successMessageTextColor: { type: String, required: true },
      successMessageBackgroundColor: { type: String, required: true },
      actionButtonBackgroundColor: { type: String, required: true },
      actionButtonTextColor: { type: String, required: true },
      // actionButtonFontFamily: { type: String, required: false },
      cancelButtonTextColor: { type: String, required: true },
      priceTextColor: { type: String, required: true },
      salePriceTextColor: { type: String, required: true },
      popupBackgroundColor: { type: String, required: true }
      // popupFontFamily: { type: String, required: false }
      // notificationBannerBackgroundColor: { type: String, required: true },
      // notificationBannerTextColor: { type: String, required: true }
    },
    products: [offerProductSchema],
    minimumProductsQuantity: { type: Number, required: true },
    collections: [offerCollectionSchema],
    discountType: {
      type: String,
      enum: ['PERCENTAGE', 'USD', 'SET_PRICE', 'NO_DISCOUNT'],
      required: true
    },
    // discountAmount
    triggerEvent: {
      type: String,
      enum: ['ADD', 'CART', 'CHECKOUT'],
      required: true
    },
    triggerProducts: [offerProductSchema],
    triggerCollections: [offerCollectionSchema],
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: false },
    enableTimer: { type: Boolean, required: true },
    timerText: { type: String, required: false },
    timerCountdownStart: { type: Number, required: false },
    allowWithDiscountCodes: { type: Boolean, required: true },
    allowMultipleUpsells: { type: Boolean, required: true },
    hideIfItemAdded: { type: Boolean, required: true },
    showNotificationBanner: { type: Boolean, required: true },
    enableQuantitySelection: { type: Boolean, required: true },
    productQuantityLimit: { type: Number, required: false },
    limitQuantitySelection: { type: Boolean, required: true },
    enableProductLinks: { type: Boolean, required: true },
    hideOutOfStockProducts: { type: Boolean, required: true },
    // discountCodes
    // discountPricingMethod
    enabled: { type: Boolean, required: true, default: true }
  },
  { timestamps: true }
);

schema.statics.findByShopifyShopId = function (shopifyShopId) {
  return Offer.find({ shopifyShopId });
};

schema.statics.findByShopId = function (shopId) {
  return Offer.find({ shop: shopId });
};

schema.methods.toString = function () {
  const data = [];

  data.push(`ID = ${this.id}`);
  data.push(`Name = ${this.name}`);
  data.push(`Shopify Shop ID = ${this.shopifyShopId}`);

  if (this.shop) {
    data.push(`Shop = ${this.shop.domain}`);
  }

  return data.join(' | ');
};

schema.pre('save', function () {
  this.$locals.wasNew = this.isNew;
});

schema.post('save', async function (offer, next) {
  await offer.populate('shop').execPopulate();
  logger.info(
    `Offer ${
      this.$locals.wasNew ? 'created' : 'updated'
    } (${offer.toString()})`,
    offer.toObject()
  );
  next();
});

schema.post('remove', async function (offer, next) {
  await offer.populate('shop').execPopulate();
  logger.info(`Offer deleted (${offer.toString()})`);
  next();
});

schema.index({ shopifyShopId: 1 });

Offer = mongodbClient.connection.model('Offer', schema);

module.exports = Offer;
