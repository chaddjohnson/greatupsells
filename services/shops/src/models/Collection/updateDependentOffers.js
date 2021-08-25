const mongodbClient = require('../mongodbClient');

const updateDependentOffers = async (collection) => {
  const Offer = mongodbClient.connection.model('Offer');
  const { shopifyCollectionId, shopifyCollectionData } = collection;
  const { title, image } = shopifyCollectionData;
  const offers = await Offer.find({
    'offeredCollections.shopifyCollectionId': shopifyCollectionId
  });

  return await Promise.all(
    offers.map(async (offer) => {
      let changed = false;

      offer.offeredCollections.forEach((offeredCollection) => {
        if (offeredCollection.shopifyCollectionId === shopifyCollectionId) {
          offeredCollection.title = title;
          offeredCollection.imageUrl = image?.src;

          changed = true;
        }
      });

      offer.triggerCollections.forEach((triggerCollection) => {
        if (triggerCollection.shopifyCollectionId === shopifyCollectionId) {
          triggerCollection.title = title;
          triggerCollection.imageUrl = image?.src;

          changed = true;
        }
      });

      if (changed) {
        offer.markModified('offeredCollection');
        offer.markModified('triggerCollections');

        return await offer.save();
      }
    })
  );
};

module.exports = updateDependentOffers;
