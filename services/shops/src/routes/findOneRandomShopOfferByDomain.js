const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { compact } = require('lodash');
const logger = require('@neatowebsolutions/upselling-logger');
const models = require('../models');

// Looks up product data for a random product given an array of Shopify product IDs.
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

  return await Product.findOneByShopifyProductId(triggerShopifyProductId);
};

const findPopupData = async (
  shop,
  {
    triggerEvent,
    shopifyProductIds,
    ipAddress,
    offerImpressions,
    sessionOfferImpressions,
    pagePath
  }
) => {
  const Offer = await models.get('Offer');
  const PopupTheme = await models.get('PopupTheme');
  const offer = await Offer.findOneRandom(shop, {
    triggerEvent,
    shopifyProductIds,
    ipAddress,
    offerImpressions,
    sessionOfferImpressions,
    pagePath
  });

  if (!offer) {
    return;
  }

  // Parallelize to minimize latency.
  const [popupTheme, triggerProduct, offeredProducts] = await Promise.all([
    PopupTheme.findById(offer.popupTheme),
    findRandomProduct(shopifyProductIds),
    offer.findRandomProducts()
  ]);

  // Reduce payload size.
  delete popupTheme.thumbnailImageUrl;

  return {
    offer,
    popupTheme,
    triggerProduct,
    offeredProducts
  };
};

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { domain } = event.pathParameters;
    const Shop = await models.get('Shop');
    const shop = await Shop.findOneByDomain(domain);
    const {
      events: triggerEvents,
      shopifyProductIds,
      ipAddress,
      offerImpressions,
      sessionOfferImpressions,
      pagePath
    } = JSON.parse(event.body);

    if (!shop) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    // Find popup data for each trigger event. Parallelize to minimize latency.
    let offersData = await Promise.all(
      triggerEvents.map(async (triggerEvent) =>
        findPopupData(shop, {
          triggerEvent,
          shopifyProductIds,
          ipAddress,
          offerImpressions,
          sessionOfferImpressions,
          pagePath
        })
      )
    );

    // Remove non-results.
    offersData = compact(offersData);

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(offersData)
    };
  } catch (error) {
    await logger.error(`Error retrieving random offer for shop`, error, {
      event
    });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
