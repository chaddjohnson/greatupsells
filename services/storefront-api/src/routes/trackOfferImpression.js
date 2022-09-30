const { URL } = require('url');
const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const HttpClient = require('@greatupsells/gateway-http-client');
const logger = require('@greatupsells/logger');

const { SHOPS_API_URL } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

const handler = middy(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.source === 'serverless-plugin-warmup') {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  try {
    const ipAddress =
      event.requestContext.identity.sourceIp ||
      event.headers['X-Forwarded-For'];
    const domain = new URL(
      event.headers.shop || event.headers.origin || event.headers.Origin
    ).host;
    const { offerId } = event.pathParameters;
    const [shop, offer] = await Promise.all([
      httpClient.get(`/shops/domain/${domain}`),
      httpClient.get(`/offers/${offerId}`)
    ]);
    const shopId = shop._id;
    const offerShopId = offer.shop;
    const {
      triggerShopifyProductId,
      triggerShopifyVariantId,
      offeredShopifyProductIds
    } = JSON.parse(event.body);

    // Only allow tracking for offers belonging to the requestor domain.
    if (shopId !== offerShopId) {
      await logger.warn(
        `Unauthorized impression tracking attempt for offer ${offerId} from domain ${domain}`,
        null,
        { event }
      );

      return {
        statusCode: StatusCodes.FORBIDDEN,
        body: ReasonPhrases.FORBIDDEN
      };
    }

    const offerHit = await httpClient.post(`/offers/${offerId}/impressions`, {
      triggerShopifyProductId,
      triggerShopifyVariantId,
      offeredShopifyProductIds,
      ipAddress
    });

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify(offerHit)
    };
  } catch (error) {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
});

handler.use(cors());

module.exports.handler = handler;
