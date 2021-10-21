const models = require('..');

const clone = async (popupTheme) => {
  const PopupTheme = await models.get('PopupTheme');
  const data = popupTheme.toObject();

  delete data.__v;
  delete data._id;
  delete data.offer;

  const clonedPopupTheme = await PopupTheme.create(data);

  return clonedPopupTheme;
};

module.exports = clone;
