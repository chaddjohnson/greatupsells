const path = require('path');
const mongodbClient = require('./mongodbClient');

let modelsLoaded = false;
let modelMap = {};

const modelPathsMap = {
  Log: path.join(__dirname, './Log')
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
  Log: await get('Log')
});

module.exports = {
  get,
  getAll
};
