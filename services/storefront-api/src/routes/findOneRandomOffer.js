const { URL } = require('url');
const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const {
  StatusCodes,
  ReasonPhrases,
  getReasonPhrase
} = require('http-status-codes');
const { aws4Interceptor } = require('aws4-axios');
const HttpClient = require('@neatowebsolutions/upselling-http-client').default;

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
    const domain = new URL(event.headers.origin || event.headers.Origin).host;
    const {
      events: triggerEvents,
      shopifyProductIds,
      shopifyVariantIds,
      shopifyCartTotal,
      shopifyCartItemCount,
      offerImpressions,
      sessionOfferImpressions,
      pagePath
    } = JSON.parse(event.body);

    // Look up offer by domain to minimize this method's latency. Multiple data
    // items are combined into one response to reduce latency.
    // Use POST instead of GET here to side step query string formatting
    // weirdness and query string length issues.
    const offersData = await httpClient.post(
      `/shops/domain/${domain}/offers/random`,
      {
        events: triggerEvents,
        shopifyProductIds,
        shopifyVariantIds,
        shopifyCartTotal,
        shopifyCartItemCount,
        ipAddress,
        offerImpressions,
        sessionOfferImpressions,
        pagePath
      }
    );

    offersData.forEach(({ offer, popupTheme }) => {
      if (offer) {
        // Exclude stats from the offer response payload.
        delete offer.acceptanceCount;
        delete offer.conversionCount;
        delete offer.conversionRate;
        delete offer.impressionCount;
        delete offer.revenueIncrease;
      }

      if (popupTheme) {
        // Exclude internal data.
        delete popupTheme.referenceUrl;
        delete popupTheme.notes;
      }
    });

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(offersData)
    };
  } catch (error) {
    if (error.response && error.response.status) {
      return {
        statusCode: error.response.status,
        body:
          JSON.stringify(error.response.data) ||
          getReasonPhrase(error.response.status)
      };
    }

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
});

handler.use(cors());

module.exports.handler = handler;
