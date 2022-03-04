const models = require('..');

const updateDependentOffers = async (product) => {
  const Offer = await models.get('Offer');
  const { shopifyProductId, shopifyProductData } = product;
  const { title, image } = shopifyProductData;
  const offers = await Offer.find({
    $or: [
      { 'triggerProducts.shopifyProductId': shopifyProductId },
      { 'offeredProducts.shopifyProductId': shopifyProductId }
    ]
  });

  return await Promise.all(
    offers.map(async (offer) => {
      let changed = false;

      offer.offeredProducts.forEach((offeredProduct) => {
        if (offeredProduct.shopifyProductId === shopifyProductId) {
          offeredProduct.title = title;
          offeredProduct.imageUrl = image?.src;

          changed = true;
        }
      });

      offer.triggerProducts.forEach((triggerProduct) => {
        if (triggerProduct.shopifyProductId === shopifyProductId) {
          triggerProduct.title = title;
          triggerProduct.imageUrl = image?.src;

          changed = true;
        }
      });

      if (changed) {
        await Offer.findByIdAndUpdate(offer.id, {
          offeredProducts: offer.offeredProducts,
          triggerProducts: offer.triggerProducts
        });
      }
    })
  );
};

module.exports = updateDependentOffers;
