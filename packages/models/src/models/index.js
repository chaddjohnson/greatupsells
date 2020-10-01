const path = require('path');
const { loadModel } = require('@chaddjohnson/mongodb-client-lambda').loader;

const { MONGODB_URI } = process.env;

const pathsMap = {
  Collection: path.join(__dirname, './Collection'),
  Offer: path.join(__dirname, './Offer'),
  OfferHit: path.join(__dirname, './OfferHit'),
  // PopupTheme: path.join(__dirname, './PopupTheme'),
  Product: path.join(__dirname, './Product'),
  Shop: path.join(__dirname, './Shop'),
  // Stat: path.join(__dirname, './Stat'),
  User: path.join(__dirname, './User')
};

const get = async (name) => loadModel(name, pathsMap, MONGODB_URI);

const getAll = async () => ({
  Collection: await get('Collection'),
  Offer: await get('Offer'),
  OfferHit: await get('OfferHit'),
  // PopupTheme: await get('PopupTheme'),
  Product: await get('Product'),
  Shop: await get('Shop'),
  // Stat: await get('Stat'),
  User: await get('User')
});

module.exports = {
  get,
  getAll
};
