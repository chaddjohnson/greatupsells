const MongodbClientLambda = require('@chaddjohnson/mongodb-client-lambda');

const { MONGODB_URI_SHOPS } = process.env;

const connectionUri = MONGODB_URI_SHOPS;
const connectionOptions = {
  reconnectTries: 30,
  reconnectInterval: 500,

  // The maximum number of sockets the MongoDB driver will keep open for this connection.
  poolSize: 5,

  // How long the MongoDB driver will wait before killing a socket due to inactivity after initial connection.
  socketTimeoutMS: 60 * 1000,

  // Keep the connection alive.
  keepAlive: true
};

const mongodbClient = new MongodbClientLambda(connectionUri, connectionOptions);

module.exports = mongodbClient;
