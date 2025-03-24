const jwt = require('jsonwebtoken');
const logger = require('@greatupsells/logger');

const { JWT_SECRET } = process.env;

// Reference: https://github.com/tmaximini/serverless-jwt-authorizer/blob/master/functions/authorize.js

const generatePolicyDocument = (effect, arn) => {
  if (!effect || !arn) {
    return null;
  }

  // Enable caching cross different Lambdas, even though they use different ARNs.
  const wildcardArn = arn.replace(/\/[^/]+\/[^/]+$/, '/*');

  const policyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: wildcardArn
      }
    ]
  };

  return policyDocument;
};

const generateAuthResponse = (principalId, effect, arn) => {
  const policyDocument = generatePolicyDocument(effect, arn);

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

  const authorizationHeader = event.authorizationToken || event.headers.Authorization || event.headers.authorization;
  const token = authorizationHeader?.replace('Bearer ', '');
  const arn = event.routeArn || event.methodArn;

  if (!token || !arn) {
    await logger.warn('Unauthorized access attempt', null, { event });
    return generateAuthResponse('anonymous', 'Deny', arn);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded) {
      return {
        ...generateAuthResponse(decoded.sub, 'Allow', arn),
        context: {
          shopId: decoded.sub
        }
      };
    } else {
      throw new Error('Cannot decode JWT');
    }
  } catch (error) {
    await logger.warn('Invalid access attempt', null, { event });

    return generateAuthResponse('user', 'Deny', arn);
  }
};

module.exports.handler = handler;
