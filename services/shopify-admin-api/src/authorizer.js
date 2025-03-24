const jwt = require('jsonwebtoken');
const logger = require('@greatupsells/logger');

const { JWT_SECRET } = process.env;

// Reference: https://github.com/tmaximini/serverless-jwt-authorizer/blob/master/functions/authorize.js

const generatePolicyDocument = (effect, arn) => {
  if (!effect || !arn) {
    return null;
  }

  // Enable caching cross different Lambdas, even though they use different ARNs.
  const wildcardArn = arn.replace(/(\/(GET|POST|PUT|DELETE|PATCH)\/shopify-admin-api)\/.*/, '$1/*');

  return {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: wildcardArn
      }
    ]
  };
};

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.source === 'serverless-plugin-warmup') {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  const authorizationHeader = event.authorizationToken || event.headers?.Authorization || event.headers?.authorization;
  const token = authorizationHeader?.replace('Bearer ', '');
  const arn = event.routeArn || event.methodArn;

  if (!token || !arn) {
    await logger.warn('Unauthorized access attempt', null, { event });

    return {
      principalId: 'anonymous',
      policyDocument: generatePolicyDocument('Deny', arn),
      context: {}
    };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    return {
      principalId: decoded.sub,
      policyDocument: generatePolicyDocument('Allow', arn),
      context: {
        shopId: decoded.sub
      }
    };
  } catch (error) {
    await logger.warn('Invalid access attempt', error, { event });

    return {
      principalId: 'unauthorized',
      policyDocument: generatePolicyDocument('Deny', arn),
      context: {}
    };
  }
};

module.exports.handler = handler;
