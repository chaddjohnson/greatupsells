const mongoose = require('mongoose');

const preValidate = async (theme, next) => {
  // Ensure ObjectId fields are indeed type ObjectId.
  if (typeof theme.offer === 'string') {
    theme.offer = mongoose.Types.ObjectId(theme.offer);
  }

  next();
};

module.exports.preValidate = preValidate;
