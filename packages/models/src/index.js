const path = require('path');
const { loadModel } = require('@chaddjohnson/mongodb-client-lambda').loader;

const { MONGODB_URI } = process.env;

const connectionUri = MONGODB_URI;
const connectionOptions = {
  reconnectTries: 30,
  reconnectInterval: 500,

  // The maximum number of sockets the MongoDB driver will keep open for this connection.
  poolSize: 5,

  // How long the MongoDB driver will wait before killing a socket due to inactivity after initial connection.
  socketTimeoutMS: 60 * 1000,

  // Keep the connection alive.
  keepAlive: true,

  // Reference: https://mongoosejs.com/docs/lambda.html
  // Buffering means mongoose will queue up operations if it gets
  // disconnected from MongoDB and send them when it reconnects.
  // With serverless, better to fail fast if not connected.
  bufferCommands: false, // Disable mongoose buffering
  bufferMaxEntries: 0, // and MongoDB driver buffering

  useNewUrlParser: true,
  useCreateIndex: true
};

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

const get = async (name) => {
  return loadModel(name, pathsMap, connectionUri, connectionOptions);
};

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
