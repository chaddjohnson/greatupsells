const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const HttpClient = require('@neatowebsolutions/upselling-http-client');
const logger = require('@neatowebsolutions/upselling-logger');

const { SHOPS_API_URL } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

const handler = middy(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const domain = event.headers.Host || event.requestContext.domainName;
    const offerId = event.pathParams.id;
    const [shop, offer] = await Promise.all([
      httpClient.get(`/shops/domain/${domain}`),
      httpClient.get(`/offers/${offerId}`)
    ]);
    const shopId = shop && shop._id;
    const offerShopId = offer.shop;
    const {
      offerHitId,
      shopifyProductId,
      shopifyVariantId,
      quantity
    } = JSON.parse(event.body);

    if (!shop || !offer) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    // Only allow tracking for offers belonging to the requestor domain.
    if (shopId !== offerShopId) {
      logger.warn(
        `Unauthorized view tracking attempt for offer ${offerId} from domain ${domain}`,
        event
      );

      return {
        statusCode: StatusCodes.FORBIDDEN,
        body: ReasonPhrases.FORBIDDEN
      };
    }

    await httpClient.post(`/offers/${offerId}/acceptances`, {
      offerHitId,
      shopifyProductId,
      shopifyVariantId,
      quantity
    });

    return {
      statusCode: StatusCodes.NO_CONTENT
    };
  } catch (error) {
    logger.error(`Error requesting shop`, error, event);

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
});

handler.use(cors());

module.exports.handler = handler;
