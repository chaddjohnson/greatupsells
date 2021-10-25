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

    Collection.createIndexes();
    OfferHit.createIndexes();
    Offer.createIndexes();
    Order.createIndexes();
    PopupTheme.createIndexes();
    Product.createIndexes();
    Shop.createIndexes();
    Stats.createIndexes();
    User.createIndexes();
  },

  async down() {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
