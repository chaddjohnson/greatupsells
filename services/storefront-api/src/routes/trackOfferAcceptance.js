const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const HttpClient = require('@greatupsells/gateway-http-client');

const { SHOPS_API_URL } = process.env;

const httpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

const handler = middy(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const { offerId } = event.pathParameters;
    const {
      offerHitId,
      shopifyDraftOrderId,
      shopifyCheckoutId,
      items,
      testToken
    } = JSON.parse(event.body);

    const offerHit = await httpClient.post(`/offers/${offerId}/acceptances`, {
      offerHitId,
      shopifyDraftOrderId,
      shopifyCheckoutId,
      items,
      testToken
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
