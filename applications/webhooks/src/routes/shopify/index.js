const express = require('express');
const crypto = require('crypto');
const { StatusCodes } = require('http-status-codes');
const logger = require('@neatowebsolutions/logger');

const appUninstall = require('./appUninstall');
const collection = require('./collection');
const collectionDeletion = require('./collectionDeletion');
const order = require('./order');
const orderCancelation = require('./orderCancelation');
const product = require('./product');
const productDeletion = require('./productDeletion');
const shop = require('./shop');

const { SHOPIFY_API_SECRET } = process.env;

// Verifies that a webhook request is valid.
const verifyHmac = (request, response, next) => {
  const hmac = request.headers['x-shopify-hmac-sha256'];
  const digest = crypto
    .createHmac('sha256', SHOPIFY_API_SECRET)
    .update(Buffer.from(request.rawBody), 'utf8')
    .digest('base64');

  // Ensure the HMAC and the calculated digest match.
  if (hmac !== digest) {
    logger.error(
      `Invalid hmac for webhook ${request.originalUrl}`,
      request.body
    );
    return response.status(StatusCodes.BAD_REQUEST).end();
  }

  next();
};

const init = (app) => {
  const router = express.Router();

  router.post('/app-uninstall', verifyHmac, appUninstall);
  router.post('/collection', verifyHmac, collection);
  router.post('/collection-deletion', verifyHmac, collectionDeletion);
  router.post('/order', verifyHmac, order);
  router.post('/order-cancelation', verifyHmac, orderCancelation);
  router.post('/product', verifyHmac, product);
  router.post('/product-deletion', verifyHmac, productDeletion);
  router.post('/shop', verifyHmac, shop);

  app.use('/shopify', router);
};

module.exports.init = init;
