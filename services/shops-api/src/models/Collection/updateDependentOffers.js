const models = require('..');

const updateDependentOffers = async (collection) => {
  const Offer = await models.get('Offer');
  const { shopifyCollectionId, shopifyCollectionData } = collection;
  const { title, handle, image } = shopifyCollectionData;
  const offers = await Offer.find({
    'offeredCollections.shopifyCollectionId': shopifyCollectionId
  });

  return await Promise.all(
    offers.map(async (offer) => {
      let changed = false;

      offer.offeredCollections.forEach((offeredCollection) => {
        if (offeredCollection.shopifyCollectionId === shopifyCollectionId) {
          offeredCollection.title = title;
          offeredCollection.handle = handle;
          offeredCollection.imageUrl = image?.src;

          changed = true;
        }
      });

      offer.triggerCollections.forEach((triggerCollection) => {
        if (triggerCollection.shopifyCollectionId === shopifyCollectionId) {
          triggerCollection.title = title;
          triggerCollection.handle = handle;
          triggerCollection.imageUrl = image?.src;

          changed = true;
        }
      });

      if (changed) {
        await Offer.findByIdAndUpdate(offer.id, {
          offeredCollection: offer.offeredCollection,
          triggerCollections: offer.triggerCollections
        });
      }
    })
  );
};

module.exports = updateDependentOffers;
