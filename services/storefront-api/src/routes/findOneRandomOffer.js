const { URL } = require('url');
const util = require('util');
const zlib = require('zlib');
const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const { StatusCodes, ReasonPhrases, getReasonPhrase } = require('http-status-codes');
const HttpClient = require('@greatupsells/gateway-http-client');

const gzip = util.promisify(zlib.gzip);

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
    const ipAddress = event.requestContext.http.sourceIp || event.headers['X-Forwarded-For'];
    const domain = new URL(event.headers.shop || event.headers.origin || event.headers.Origin).host;
    const {
      events: triggerEvents,
      shopifyProductIds,
      shopifyVariantIds,
      shopifyCartTotal,
      shopifyCartItemCount,
      shopifyOrderId,
      offerImpressions,
      sessionOfferImpressions,
      pagePath,
      testToken,
      testOfferId
    } = JSON.parse(event.body);

    if (!domain) {
      return {
        statusCode: StatusCodes.FORBIDDEN,
        body: ReasonPhrases.FORBIDDEN
      };
    }

    // Look up offer by domain to minimize this method's latency. Multiple data
    // items are combined into one response to reduce latency.
    // Use POST instead of GET here to side step query string formatting
    // weirdness and query string length issues.
    const offersData = await httpClient.post(`/shops/domain/${domain}/offers/random`, {
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
      testToken,
      testOfferId
    });

    offersData.forEach(({ offer, theme }) => {
      if (offer) {
        // Exclude stats from the offer response payload.
        delete offer.acceptanceCount;
        delete offer.conversionCount;
        delete offer.conversionRate;
        delete offer.impressionCount;
        delete offer.revenueIncrease;
      }

      if (theme) {
        // Exclude internal data.
        delete theme.referenceUrl;
        delete theme.notes;
      }
    });

    // Compress data to reduce bandwidth as this is a high-traffic endpoint.
    const acceptEncoding = event.headers['accept-encoding'] || event.headers['Accept-Encoding'];
    const gzipAccepted = acceptEncoding.includes('gzip');
    const buffer = Buffer.from(JSON.stringify(offersData), 'utf-8');
    const compressedData = await gzip(buffer);
    const compressedEncodedData = compressedData.toString('base64');

    return {
      statusCode: StatusCodes.OK,
      headers: {
        'Content-Type': 'application/json',
        'Content-Encoding': 'gzip'
      },
      isBase64Encoded: true,
      body: gzipAccepted ? compressedEncodedData : JSON.stringify(offersData)
    };
  } catch (error) {
    if (error.response && error.response.status) {
      return {
        statusCode: error.response.status,
        body: JSON.stringify(error.response.data) || getReasonPhrase(error.response.status)
      };
    }

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
});

handler.use(cors());

module.exports.handler = handler;
