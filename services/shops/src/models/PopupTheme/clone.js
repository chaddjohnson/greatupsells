const clone = async (popupTheme) => {
  const PopupTheme = popupTheme.constructor;
  const data = popupTheme.toObject();

  delete data._id;
  delete data.offer;
  delete data.shop;

  const clonedPopupTheme = await PopupTheme.create(data);

  return clonedPopupTheme;
};

module.exports = clone;
