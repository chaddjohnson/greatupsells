const { ApolloServer } = require('apollo-server-lambda');
const { get } = require('lodash');
const jwt = require('jsonwebtoken');
const models = require('@neatowebsolutions/upselling-models');
const schema = require('../schema');

const dev = process.env.NODE_ENV !== 'production';

const { JWT_SECRET } = process.env;

const getModels = async () => ({
  Shop: await models.get('Shop'),
  Offer: await models.get('Offer'),
  Product: await models.get('Product')
});

const getShop = async (context) => {
  let token =
    get(context, 'event.headers.Authorization', '') ||
    get(context, 'event.headers.authorization', '');

  token = token.replace('Bearer ', '');

  if (!token) {
    // No shop will be available for context.
    return null;
  }

  try {
    const { shopDomain } = jwt.verify(token, JWT_SECRET);
    const Shop = await models.get('Shop');
    const shop = await Shop.findByDomain(shopDomain);

    if (!shop) {
      throw new Error('Invalid shop');
    }

    return shop;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

const contextHandler = async (context) => {
  if (!context) {
    throw new Error('context was not provided');
  }

  const allModels = await getModels();
  const shop = await getShop(context);

  return {
    ...context,
    ...allModels,
    shop
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
