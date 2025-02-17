const models = require('..');

const clone = async (offer) => {
  const [Offer, Theme] = await Promise.all([models.get('Offer'), models.get('Theme')]);
  const data = offer.toObject();

  delete data.__v;
  delete data._id;
  delete data.impressionCount;
  delete data.acceptanceCount;
  delete data.conversionCount;
  delete data.conversionRate;
  delete data.revenueIncrease;

  data.name = `${data.name} (copy)`;

  const [clonedOffer, theme] = await Promise.all([Offer.create(data), Theme.findById(offer.theme)]);
  const clonedTheme = await theme.clone();

  // Link the cloned offer and the cloned popup.
  clonedOffer.theme = clonedTheme._id;
  clonedTheme.offer = clonedOffer._id;

  await Promise.all([clonedOffer.save(), clonedTheme.save()]);

  return clonedOffer;
};

module.exports = clone;
