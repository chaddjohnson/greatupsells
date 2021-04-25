const mongoose = require('mongoose');

const preValidate = async (popupTheme, next) => {
  // Ensure ObjectId fields are indeed type ObjectId.
  if (typeof popupTheme.shop === 'string') {
    popupTheme.shop = mongoose.Types.ObjectId(popupTheme.shop);
  }
  if (typeof popupTheme.offer === 'string') {
    popupTheme.offer = mongoose.Types.ObjectId(popupTheme.offer);
  }

  next();
};

module.exports.preValidate = preValidate;
