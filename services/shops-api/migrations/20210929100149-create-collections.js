const models = require('../src/models');

module.exports = {
  async up() {
    const Collection = await models.get('Collection');
    const OfferHit = await models.get('OfferHit');
    const Offer = await models.get('Offer');
    const Order = await models.get('Order');
    const Theme = await models.get('Theme');
    const Product = await models.get('Product');
    const Shop = await models.get('Shop');
    const Stats = await models.get('Stats');
    const User = await models.get('User');

    await Collection.createCollection();
    await OfferHit.createCollection();
    await Offer.createCollection();
    await Order.createCollection();
    await Theme.createCollection();
    await Product.createCollection();
    await Shop.createCollection();
    await Stats.createCollection();
    await User.createCollection();
  },

  async down() {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
