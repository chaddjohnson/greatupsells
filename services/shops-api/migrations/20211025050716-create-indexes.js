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

    await Collection.createIndex({ shop: 1 });
    await Collection.createIndex({ shopifyShopId: 1 });
    await Collection.createIndex({ shopifyCollectionId: 1 }, { unique: true });
    await Collection.createIndex({ shopifyProductIds: 1 });

    await OfferHit.createIndex({ shop: 1 });
    await OfferHit.createIndex({ offer: 1 });
    await OfferHit.createIndex({ order: 1 });
    await OfferHit.createIndex({ createdAt: 1 });
    await OfferHit.createIndex({ acceptedAt: 1 });
    await OfferHit.createIndex({ convertedAt: 1 });

    await Offer.createIndex({ shop: 1 });
    await Offer.createIndex({ shopifyShopId: 1 });
    await Offer.createIndex({ createdAt: -1 });

    await Order.createIndex(
      { shopifyShopId: 1, shopifyOrderNumber: 1 },
      { unique: true }
    );
    await Order.createIndex({ shopifyOrderId: 1 }, { unique: true });

    await PopupTheme.createIndex({ offer: 1 }, { sparse: true });

    await Product.createIndex({ shop: 1 });
    await Product.createIndex({ shopifyShopId: 1 });
    await Product.createIndex({ shopifyProductId: 1 }, { unique: true });
    await Product.createIndex({ shopifyCollectionIds: 1 });
    await Product.createIndex({ 'shopifyProductData.variants.id': 1 });

    await Shop.createIndex({ shopifyShopId: 1 }, { unique: true });
    await Shop.createIndex({ domain: 1 }, { unique: true });
    await Shop.createIndex({ alternateDomain: 1 });
    await Shop.createIndex({ createdAt: -1 });

    await Stats.createIndex({ createdAt: -1 });

    await User.createIndex({ emailAddress: 1 });
  },

  async down() {
    //
  }
};
