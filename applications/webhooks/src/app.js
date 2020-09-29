const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const getenv = require('getenv');
const http = require('http');
const https = require('https');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const bodyParser = require('body-parser');
const httpStatus = require('http-status-codes');
const mongodbClientFactory = require('@chaddjohnson/mongodb-client-lambda')
  .factory;
const logger = require('@neatowebsolutions/logger');
const router = require('./router');

const { MONGODB_URI, LOG_LEVEL } = process.env;

// Initialize the service.
const app = express();
const port = getenv.int('WEBHOOKS_API_PORT');
const mongodbClient = mongodbClientFactory.get(MONGODB_URI);

// Enables access to raw request data.
const rawBodySaver = (request, response, buffer, encoding) => {
  if (buffer && buffer.length) {
    request.rawBody = buffer.toString(encoding || 'utf8');
  }
};

// Handles cleanup on exit.
const gracefulExit = (code = 0) => {
  // Disconnect from MongoDB.
  mongodbClient.disconnect(() => {
    process.exit(code);
  });
};

// Load config.
dotenvExpand(dotenv.config({ path: '../../.env' }));

// Set the maximum number of concurrent requests allowed.
http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

// Enable socket keepAlive.
http.globalAgent.options.keepAlive = true;
https.globalAgent.options.keepAlive = true;

// TODO: Configure logging. See https://github.com/logicbox-llc/wc-fulfillment-api/blob/develop/src/bootstrappers/logging.js.

// Configure middleware.
if (LOG_LEVEL === 'debug') {
  app.use(morgan('dev'));
}
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: true,
    allowedHeaders: ['Content-Type'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  })
);
app.use(bodyParser.json({ verify: rawBodySaver, limit: '1000kb' }));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyParser.raw({ verify: rawBodySaver, type: 'application/json' }));

// Initialize route handlers.
router.init(app);

// Handle uncaptured errors.
app.use((error, request, response, next) => {
  if (!error) {
    return next();
  }
  logger.error(
    `Uncaptured webhook request error with ${request.method} ${request.originalUrl}`,
    error
  );
  response
    .status(httpStatus.INTERNAL_SERVER_ERROR)
    .send('Internal Server Error');
});

// Log and exit on uncaught exception.
process
  .on('uncaughtException', (error) => {
    logger.error('An uncaught exception occurred', error);

    // Allow logging to finish before cleaning up and exiting.
    setTimeout(() => gracefulExit(1), 300);
  })
  .on('unhandledRejection', (reason) =>
    logger.warn('An uncaught rejection occurred', reason)
  )
  .on('warning', (warning) => logger.warn('A warning occurred', warning));

// Clean up if the process ends.
process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

// Start the service.
app.listen(port, () => logger.debug(`API listening on port ${port}`));
