const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const {
  SHOPIFY_ADMIN_APP_API_KEY,
  SHOPIFY_ADMIN_APP_API_SECRET_KEY
} = process.env;

const handler = middy(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.source === 'serverless-plugin-warmup') {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  try {
    const { referenceId, changes, token: inputToken } = JSON.parse(event.body);
    const decodedToken = jwt.verify(
      inputToken,
      SHOPIFY_ADMIN_APP_API_SECRET_KEY
    );
    const decodedReferenceId =
      decodedToken.input_data.initialPurchase.referenceId;

    if (decodedReferenceId !== referenceId) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        body: ReasonPhrases.BAD_REQUEST
      };
    }

    const payload = {
      iss: SHOPIFY_ADMIN_APP_API_KEY,
      jti: uuidv4(),
      iat: Date.now(),
      sub: referenceId,
      changes
    };

    const token = jwt.sign(payload, SHOPIFY_ADMIN_APP_API_SECRET_KEY);

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify({ token })
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
