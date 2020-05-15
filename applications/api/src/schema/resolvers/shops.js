const jwt = require('jsonwebtoken');
const queryString = require('query-string');
const ShopifyToken = require('shopify-token');

const {
  SHOPIFY_APP_API_KEY,
  SHOPIFY_APP_API_SECRET_KEY,
  SHOPIFY_APP_URL,
  JWT_SECRET
} = process.env;

module.exports.shops = async (root, args, context) => {
  const { Shop } = context;
  const shop = await Shop.find();

  // TODO: Authorization

  return shop;
};

module.exports.shop = async (root, args, context) => {
  const { Shop } = context;
  const shop = await Shop.findById(args.id);

  // TODO: Authorization

  return shop;
};

module.exports.shopOffers = async (root, args, context) => {
  const { Offer } = context;
  const offers = Offer.findByShopId(root.id);

  return offers;
};

module.exports.shopProducts = async (root, args, context) => {
  const { Product } = context;
  const products = await Product.findByShopId(root.id);

  return products;
};

module.exports.shopToken = async (root, args, context) => {
  const { Shop } = context;
  const queryParams = queryString.parse(args.queryString);
  const { shop: shopDomain } = queryParams;

  const shopifyToken = new ShopifyToken({
    apiKey: SHOPIFY_APP_API_KEY,
    sharedSecret: SHOPIFY_APP_API_SECRET_KEY,
    redirectUri: SHOPIFY_APP_URL
  });

  // Validate the HMAC.
  const hmacValid = shopifyToken.verifyHmac(queryParams);

  if (!hmacValid) {
    throw new Error('Invalid request');
  }

  try {
    const shop = await Shop.findByDomain(shopDomain);

    if (!shop) {
      throw new Error('Shop not found');
    }

    try {
      // Ensure the access token is valid.
      await shop.validateAccessToken();
    } catch (error) {
      // Remove the invalid access token.
      await shop.removeAccessToken();

      // Proceed with error handling.
      throw error;
    }

    // Generate a JWT.
    const token = jwt.sign({ shopDomain }, JWT_SECRET);

    return { token };
  } catch (error) {
    throw new Error(`Unable to obtain access token: ${error.message}`);
  }
};
