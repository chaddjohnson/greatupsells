const jwt = require('jsonwebtoken');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');

const { JWT_SECRET } = process.env;

const secret = Buffer.from(JWT_SECRET, 'base64');

// Reference: https://github.com/tmaximini/serverless-jwt-authorizer/blob/master/functions/authorize.js

const generatePolicyDocument = (effect, methodArn) => {
  if (!effect || !methodArn) {
    return null;
  }

  const policyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: methodArn
      }
    ]
  };

  return policyDocument;
};

const generateAuthResponse = (principalId, effect, methodArn) => {
  const policyDocument = generatePolicyDocument(effect, methodArn);

  return {
    principalId,
    policyDocument
  };
};

const handler = async (event) => {
  const token =
    event.headers.Authorization &&
    event.headers.Authorization.replace('Bearer ', '');
  const { methodArn } = event;

  if (!token || !methodArn) {
    await logger.warn('Unauthorized access attempt', event);

    return {
      statusCode: StatusCodes.UNAUTHORIZED,
      body: ReasonPhrases.UNAUTHORIZED
    };
  }

  const decoded = jwt.verify(token, secret);

  if (decoded) {
    return {
      ...generateAuthResponse(decoded.userId, 'Allow', methodArn),
      context: {
        userId: decoded.userId
      }
    };
  } else {
    await logger.warn('Invalid access attempt', decoded, event);

    return generateAuthResponse(decoded.userId, 'Deny', methodArn);
  }
};

module.exports.handler = handler;
