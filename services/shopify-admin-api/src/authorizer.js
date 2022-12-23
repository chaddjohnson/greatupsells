const jwt = require('jsonwebtoken');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@greatupsells/logger');

const { JWT_SECRET } = process.env;

// Reference: https://github.com/tmaximini/serverless-jwt-authorizer/blob/master/functions/authorize.js

const generatePolicyDocument = (effect, routeArn) => {
  if (!effect || !routeArn) {
    return null;
  }

  const policyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: routeArn
      }
    ]
  };

  return policyDocument;
};

const generateAuthResponse = (principalId, effect, routeArn) => {
  const policyDocument = generatePolicyDocument(effect, routeArn);

  return {
    principalId,
    policyDocument
  };
};

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.source === 'serverless-plugin-warmup') {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  const authorizationHeader =
    event.headers.Authorization || event.headers.authorization;
  const token = authorizationHeader?.replace('Bearer ', '');
  const { routeArn } = event;

  if (!token || !routeArn) {
    await logger.warn('Unauthorized access attempt', null, { event });

    return {
      statusCode: StatusCodes.UNAUTHORIZED,
      body: ReasonPhrases.UNAUTHORIZED
    };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded) {
      return {
        ...generateAuthResponse(decoded.shopId, 'Allow', routeArn),
        context: {
          shopId: decoded.shopId
        }
      };
    } else {
      throw new Error('Cannot decode JWT');
    }
  } catch (error) {
    await logger.warn('Invalid access attempt', null, { event });

    return generateAuthResponse('user', 'Deny', routeArn);
  }
};

module.exports.handler = handler;
