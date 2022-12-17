const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@greatupsells/logger');
const mongodbClient = require('../models/mongodbClient');
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
    shopifyVariantIds,
    shopifyCartTotal,
    shopifyCartItemCount,
    shopifyOrderId,
    ipAddress,
    offerImpressions,
    sessionOfferImpressions,
    pagePath,
    testOfferId
  }
) => {
  const [Offer, Theme] = await Promise.all([
    models.get('Offer'),
    models.get('Theme')
  ]);
  const offer = await Offer.findOneRandom(shop, {
    triggerEvent,
    shopifyProductIds,
    shopifyVariantIds,
    shopifyCartTotal,
    shopifyCartItemCount,
    shopifyOrderId,
    ipAddress,
    offerImpressions,
    sessionOfferImpressions,
    pagePath,
    testOfferId
  });

  if (!offer) {
    return;
  }

  // Parallelize to minimize latency.
  const [theme, triggerProduct, offeredProducts] = await Promise.all([
    Theme.findById(offer.theme).lean(),
    findRandomProduct(shopifyProductIds),
    offer.findRandomProducts(shopifyProductIds, pagePath)
  ]);

  // Reduce payload size.
  delete theme.thumbnailImageUrl;

  return {
    offer,
    theme,
    triggerProduct,
    offeredProducts
  };
};

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await mongodbClient.connect();

  if (event.source === 'serverless-plugin-warmup') {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  try {
    const { domain } = event.pathParameters;
    const Shop = await models.get('Shop');
    const shop = await Shop.findOneByDomain(domain);
    const parsedBody = JSON.parse(event.body);
    const {
      events: triggerEvents,
      shopifyProductIds,
      shopifyVariantIds,
      shopifyCartTotal,
      shopifyCartItemCount,
      shopifyOrderId,
      ipAddress,
      offerImpressions,
      sessionOfferImpressions,
      pagePath,
      testOfferId
    } = parsedBody;
    let { testToken } = parsedBody;

    if (!shop) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    // Ignore the test token if incorrect.
    if (testToken !== shop.testToken) {
      testToken = undefined;
    }

    // Find popup data for each trigger event. Parallelize to minimize latency.
    let offersData = await Promise.all(
      triggerEvents.map(async (triggerEvent) =>
        findPopupData(shop, {
          triggerEvent,
          shopifyProductIds,
          shopifyVariantIds,
          shopifyCartTotal,
          shopifyCartItemCount,
          shopifyOrderId,
          ipAddress,
          offerImpressions,
          sessionOfferImpressions,
          pagePath,
          testOfferId: testToken ? testOfferId : undefined
        })
      )
    );

    // Remove non-results.
    offersData = offersData.filter(Boolean);

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
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
