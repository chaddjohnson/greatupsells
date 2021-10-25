const models = require('../src/models');

module.exports = {
  async up() {
    const Collection = await models.get('Collection');
    const OfferHit = await models.get('OfferHit');
    const Offer = await models.get('Offer');
    const Order = await models.get('Order');
    const PopupTheme = await models.get('PopupTheme');
    const Product = await models.get('Product');
    const Shop = await models.get('Shop');
    const Stats = await models.get('Stats');
    const User = await models.get('User');

    await Collection.index({ shop: 1 });
    await Collection.index({ shopifyShopId: 1 });
    await Collection.index({ shopifyCollectionId: 1 }, { unique: true });
    await Collection.index({ shopifyProductIds: 1 });

    await OfferHit.index({ shop: 1 });
    await OfferHit.index({ offer: 1 });
    await OfferHit.index({ order: 1 });
    await OfferHit.index({ createdAt: 1 });
    await OfferHit.index({ acceptedAt: 1 });
    await OfferHit.index({ convertedAt: 1 });

    await Offer.index({ shop: 1 });
    await Offer.index({ shopifyShopId: 1 });
    await Offer.index({ createdAt: -1 });

    await Order.index(
      { shopifyShopId: 1, shopifyOrderNumber: 1 },
      { unique: true }
    );
    await Order.index({ shopifyOrderId: 1 }, { unique: true });

    await PopupTheme.index({ offer: 1 }, { sparse: true });

    await Product.index({ shop: 1 });
    await Product.index({ shopifyShopId: 1 });
    await Product.index({ shopifyProductId: 1 }, { unique: true });
    await Product.index({ shopifyCollectionIds: 1 });
    await Product.index({ 'shopifyProductData.variants.id': 1 });

    await Shop.index({ shopifyShopId: 1 }, { unique: true });
    await Shop.index({ domain: 1 }, { unique: true });
    await Shop.index({ alternateDomain: 1 });
    await Shop.index({ createdAt: -1 });

    await Stats.index({ createdAt: -1 });

    await User.index({ emailAddress: 1 });
  },

  async down() {
    //
  }
};
