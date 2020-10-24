module.exports.preValidate = (shop, next) => {
  // Remove extraneous characters from the contact phone number.
  if (shop.contactPhone) {
    shop.contactPhone = shop.contactPhone.toString().replace(/[^\d\+]/g, '');
  }

  next();
};
