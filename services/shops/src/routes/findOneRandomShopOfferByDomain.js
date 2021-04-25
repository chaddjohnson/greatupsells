const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

const findRandomProduct = async (shopifyProductIds = []) => {
  const Product = await models.get('Product');
  const hasTriggerProducts = shopifyProductIds.length > 0;
  const randomProductIndex = Math.floor(
    Math.random() * shopifyProductIds.length
  );
  const triggerShopifyProductId = shopifyProductIds[randomProductIndex];

  if (!hasTriggerProducts || !triggerShopifyProductId) {
    return;
  }

  return await Product.findByShopifyProductId(triggerShopifyProductId);
};

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { domain } = event.pathParameters;
    const { event: triggerEvent, ipAddress } =
      event.queryStringParameters || {};
    const { shopifyProductIds } = event.multiValueQueryStringParameters || {};
    const Shop = await models.get('Shop');
    const Offer = await models.get('Offer');
    const PopupTheme = await models.get('PopupTheme');
    const shop = await Shop.findByDomain(domain);

    if (!shop) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    const offer = await Offer.findOneRandom(
      shop,
      triggerEvent,
      shopifyProductIds,
      ipAddress
    );

    if (!offer) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    // Parallelize to minimize latency.
    const [popupTheme, triggerProduct, offeredProducts] = await Promise.all([
      PopupTheme.findById(offer.popupTheme),
      findRandomProduct(shopifyProductIds),
      offer.findRandomProducts()
    ]);

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify({
        offer,
        popupTheme,
        triggerProduct,
        offeredProducts
      })
    };
  } catch (error) {
    await logger.error(`Error retrieving random offer for shop`, error, event);

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
