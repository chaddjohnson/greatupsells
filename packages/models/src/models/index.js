const path = require('path');
const { loadModel } = require('@chaddjohnson/mongodb-client-lambda').loader;

const { MONGODB_URI } = process.env;

const pathsMap = {
  Shop: path.join(__dirname, './Shop'),
  ShopifyShop: path.join(__dirname, './Shop/ShopifyShop'),
  Offer: path.join(__dirname, './Offer'),
  PopupTheme: path.join(__dirname, './PopupTheme'),
  Product: path.join(__dirname, './Product'),
  ShopifyProduct: path.join(__dirname, './Product/ShopifyProduct'),
  Stat: path.join(__dirname, './Stat')
};

module.exports.get = async (name) => loadModel(name, pathsMap, MONGODB_URI);
