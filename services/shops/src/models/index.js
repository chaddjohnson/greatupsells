const path = require('path');
const mongodbClient = require('./mongodbClient');

let modelsLoaded = false;
let modelMap = {};

const modelPathsMap = {
  Collection: path.join(__dirname, './Collection'),
  Offer: path.join(__dirname, './Offer'),
  OfferHit: path.join(__dirname, './OfferHit'),
  Order: path.join(__dirname, './Order'),
  PopupTheme: path.join(__dirname, './PopupTheme'),
  Product: path.join(__dirname, './Product'),
  Shop: path.join(__dirname, './Shop'),
  Stats: path.join(__dirname, './Stats'),
  User: path.join(__dirname, './User')
};

const loadModels = () => {
  if (modelsLoaded) {
    return modelMap;
  }

  const modelNames = Object.keys(modelPathsMap);

  // Build a map of models indexed by model name.
  modelMap = modelNames.reduce((map, modelName) => {
    return {
      ...map,
      [modelName]: require(modelPathsMap[modelName]) // eslint-disable-line import/no-dynamic-require
    };
  }, {});

  modelsLoaded = true;

  return modelMap;
};

const get = async (modelName) => {
  if (mongodbClient.connected && modelMap[modelName]) {
    return modelMap[modelName];
  }

  // If the bufferCommands connection option is false, the connection must be established prior to models being loaded.
  await mongodbClient.connect();

  loadModels();

  return modelMap[modelName];
};

const getAll = async () => ({
  Collection: await get('Collection'),
  Offer: await get('Offer'),
  OfferHit: await get('OfferHit'),
  Order: await get('Order'),
  PopupTheme: await get('PopupTheme'),
  Product: await get('Product'),
  Shop: await get('Shop'),
  Stats: await get('Stats'),
  User: await get('User')
});

module.exports = {
  get,
  getAll
};
