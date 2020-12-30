// TODO: Improve upon this as needed.

// const middy = require('@middy/core');
// const cors = require('@middy/http-cors');
// const { StatusCodes, ReasonPhrases } = require('http-status-codes');
// const HttpClient = require('@neatowebsolutions/upselling-http-client');
// const logger = require('@neatowebsolutions/upselling-logger');

// const { SHOPS_API_URL } = process.env;

// const httpClient = new HttpClient({
//   baseUrl: SHOPS_API_URL
// });

// const handler = middy(async (event, context) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   try {
//     const offerId = event.pathParams.id;
//     const offer = await httpClient.get(`/offers/${offerId}`);

//     await httpClient.post(`/offers/${offerId}/views`, offer);

//     return {
//       statusCode: StatusCodes.NO_CONTENT
//     };
//   } catch (error) {
//     logger.error(`Error requesting shop`, error, event);

//     return {
//       statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
//       body: ReasonPhrases.INTERNAL_SERVER_ERROR
//     };
//   }
// });

// handler.use(cors());

// module.exports.handler = handler;
