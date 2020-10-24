const { ApolloServer, ApolloError } = require('apollo-server-lambda');
const jwt = require('jsonwebtoken');
const models = require('@neatowebsolutions/upselling-models');
const schema = require('../schema');

const dev = process.env.NODE_ENV !== 'production';

const { JWT_SECRET } = process.env;

const getTokenData = (event) => {
  const authHeader =
    event.headers.Authorization || event.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new ApolloError('Invalid token');
  }
};

const contextHandler = async ({ event, context }) => {
  const { shopDomain, emailAddress } = getTokenData(event);
  const host = event.headers.Host || event.requestContext.domainName;
  const ip =
    event.requestContext.identity.sourceIp || event.headers['X-Forwarded-For'];
  const allModels = await models.getAll();
  const { Shop, User } = allModels;
  const shop = await Shop.findByDomain(shopDomain);
  const user = await User.findByEmailAddress(emailAddress);

  // Provide common, useful things via context.
  return {
    event,
    context,
    host,
    ip,
    shop,
    user,
    ...allModels
  };
};

const server = new ApolloServer({
  schema,
  playground: {
    endpoint: dev ? '/dev/graphql' : '/graphql'
  },
  context: contextHandler
});
const config = {
  cors: {
    origin: '*',
    credentials: true
  }
};

module.exports.handler = server.createHandler(config);
