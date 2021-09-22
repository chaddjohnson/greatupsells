const models = require('..');

const clone = async (offer) => {
  const Offer = await models.get('Offer');
  const PopupTheme = await models.get('PopupTheme');
  const data = offer.toObject();

  delete data.__v;
  delete data._id;
  delete data.impressionCount;
  delete data.acceptanceCount;
  delete data.conversionCount;
  delete data.conversionRate;
  delete data.revenueIncrease;

  data.name = `${data.name} (copy)`;

  const [clonedOffer, popupTheme] = await Promise.all([
    Offer.create(data),
    PopupTheme.findById(offer.popupTheme)
  ]);
  const clonedPopupTheme = await popupTheme.clone();

  // Link the cloned offer and the cloned popup.
  clonedOffer.popupTheme = clonedPopupTheme._id;
  clonedPopupTheme.offer = clonedOffer._id;

  await Promise.all([clonedOffer.save(), clonedPopupTheme.save()]);

  return clonedOffer;
};

module.exports = clone;
