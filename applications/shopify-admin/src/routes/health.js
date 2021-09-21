const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const handler = middy(async (event) => {
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUp - Lambda is warm!'); // eslint-disable-line no-console // eslint-disable-line no-console
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  return {
    statusCode: StatusCodes.OK,
    body: ReasonPhrases.OK
  };
});

handler.use(cors());

module.exports.handler = handler;
