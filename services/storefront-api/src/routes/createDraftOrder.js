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

  if (event.source === 'serverless-plugin-warmup') {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  try {
    const domain = new URL(event.headers.origin || event.headers.Origin).host;
    const shop = await httpClient.get(`/shops/domain/${domain}`);
    const shopId = shop._id;
    const data = JSON.parse(event.body);
    const { lineItems } = data;

    // Verify offers associated with line items belong to the shop.
    const offerIds = lineItems.map(({ offerId }) => offerId).filter(Boolean);
    const offers = await Promise.all(
      offerIds.map(async (offerId) => httpClient.get(`/offers/${offerId}`))
    );
    const offersBelongToShop = offers.every((offer) => offer.shop === shopId);

    if (!offersBelongToShop) {
      await logger.warn(
        `Unauthorized usage attempt for offer from domain ${domain}`,
        null,
        { event }
      );

      return {
        statusCode: StatusCodes.FORBIDDEN,
        body: ReasonPhrases.FORBIDDEN
      };
    }

    const draftOrder = await httpClient.post(
      `/shops/${shopId}/draft-orders`,
      data
    );

    return {
      statusCode: StatusCodes.CREATED,
      body: JSON.stringify(draftOrder)
    };
  } catch (error) {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
});

handler.use(cors());

module.exports.handler = handler;
