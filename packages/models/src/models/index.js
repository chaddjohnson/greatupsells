const path = require('path');
const { loadModel } = require('@chaddjohnson/mongodb-client-lambda').loader;

const { MONGODB_URI } = process.env;

const pathsMap = {
  Offer: path.join(__dirname, './Offer'),
  OfferHit: path.join(__dirname, './OfferHit'),
  // OfferProduct: path.join(__dirname, './OfferProduct'),
  PopupTheme: path.join(__dirname, './PopupTheme'),
  Product: path.join(__dirname, './Product'),
  Shop: path.join(__dirname, './Shop'),
  Stat: path.join(__dirname, './Stat')
};

module.exports.get = async (name) => loadModel(name, pathsMap, MONGODB_URI);
