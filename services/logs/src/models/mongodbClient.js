const MongoDBClient = require('@chaddjohnson/mongodb-client-lambda');

const { MONGODB_URI_LOGS } = process.env;

const connectionUri = MONGODB_URI_LOGS;
const connectionOptions = {
  reconnectTries: 30,
  reconnectInterval: 500,

  // The maximum number of sockets the MongoDB driver will keep open for this connection.
  poolSize: 5,

  // How long the MongoDB driver will wait before killing a socket due to inactivity after initial connection.
  socketTimeoutMS: 60 * 1000,

  // Keep the connection alive.
  keepAlive: true,

  // Opt in to using the MongoDB driver's findOneAndUpdate() function.
  // See https://mongoosejs.com/docs/deprecations.html#findandmodify.
  useFindAndModify: false
};

const mongodbClient = new MongoDBClient(connectionUri, connectionOptions);

module.exports = mongodbClient;
