const { URL } = require('url');
const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { aws4Interceptor } = require('aws4-axios');
const HttpClient = require('@neatowebsolutions/upselling-http-client').default;
const logger = require('@neatowebsolutions/upselling-logger');

const { AWS_REGION, SHOPS_API_URL } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

httpClient.addRequestInterceptor(
  aws4Interceptor({
    region: AWS_REGION,
    service: 'execute-api'
  })
);

const handler = middy(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const ipAddress =
      event.requestContext.identity.sourceIp ||
      event.headers['X-Forwarded-For'];
    const domain = new URL(event.headers.Origin).host;
    const { offerId } = event.pathParameters;
    const [shop, offer] = await Promise.all([
      httpClient.get(`/shops/domain/${domain}`),
      httpClient.get(`/offers/${offerId}`)
    ]);
    const shopId = shop && shop._id;
    const offerShopId = offer.shop;
    const {
      triggerShopifyProductId,
      shopifyProductIds,
      shopifyVariantIds
    } = JSON.parse(event.body);

    if (!shop || !offer) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        body: ReasonPhrases.NOT_FOUND
      };
    }

    // Only allow tracking for offers belonging to the requestor domain.
    if (shopId !== offerShopId) {
      await logger.warn(
        `Unauthorized view tracking attempt for offer ${offerId} from domain ${domain}`,
        event
      );

      return {
        statusCode: StatusCodes.FORBIDDEN,
        body: ReasonPhrases.FORBIDDEN
      };
    }

    const offerHit = await httpClient.post(`/offers/${offerId}/views`, {
      triggerShopifyProductId,
      shopifyProductIds,
      shopifyVariantIds,
      ipAddress
    });

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify(offerHit)
    };
  } catch (error) {
    await logger.error(`Error tracking offer view`, error, event);

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
});

handler.use(cors());

module.exports.handler = handler;
