require('@shopify/shopify-api/adapters/node');

const getenv = require('getenv');
const path = require('path');
const serverless = require('serverless-http');
const express = require('express');
const helmet = require('helmet');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { shopifyApi, ApiVersion } = require('@shopify/shopify-api');
const verifySessionToken = require('shopify-jwt-auth-verify').default;
const HttpClient = require('@greatupsells/gateway-http-client');

const {
  NODE_ENV,
  SHOPIFY_ADMIN_APP_API_KEY,
  SHOPIFY_ADMIN_APP_API_SECRET_KEY,
  SHOPIFY_ADMIN_APP_URL,
  STOREFRONT_PORT,
  SHOPS_API_URL,
  JWT_SECRET
} = process.env;
const dev = NODE_ENV !== 'production';
const port = getenv.int('SHOPIFY_ADMIN_APP_PORT', 4001);
const app = next({ dev });

const shopsServiceHttpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});
const shopify = shopifyApi({
  apiKey: SHOPIFY_ADMIN_APP_API_KEY,
  apiSecretKey: SHOPIFY_ADMIN_APP_API_SECRET_KEY,
  scopes: [
    'read_all_orders',
    'read_checkouts',
    'read_draft_orders',
    'read_orders',
    'read_products',
    'read_script_tags',
    'read_themes',
    'write_themes',
    'write_draft_orders',
    'write_script_tags'
  ],
  hostName: new URL(SHOPIFY_ADMIN_APP_URL).host,
  apiVersion: ApiVersion.October22,
  isEmbeddedApp: true
});

const createServer = () => {
  const server = express();
  const handle = app.getRequestHandler();

  const handleAppRequest = async (request, response) => {
    await handle(request, response);
    response.statusCode = 200;
  };

  // Secure HTTP headers. Disable some things so that the app may be embedded within Shopify Admin.
  server.use(helmet.hidePoweredBy());
  server.use(helmet.hsts());
  server.use(helmet.ieNoOpen());
  server.use(helmet.noSniff());
  server.use(helmet.permittedCrossDomainPolicies());
  server.use(helmet.referrerPolicy());
  server.use(helmet.xssFilter());

  // Set up dev proxies.
  if (dev) {
    // Necessary as Shopify script tags must be hosted on a public URL.
    server.use(
      '/storefront.js',
      createProxyMiddleware({
        target: `http://localhost:${STOREFRONT_PORT}`,
        changeOrigin: true,
        onProxyRes: (proxyResponse) => {
          proxyResponse.headers['Accept-Encoding'] = 'gzip';
        }
      })
    );

    // Necessary to enable tunneling for themes in storefront.
    server.use(
      '/themes',
      createProxyMiddleware({
        target: `http://localhost:${STOREFRONT_PORT}`,
        changeOrigin: true,
        pathRewrite: { '^/themes': '' },
        onProxyRes: (proxyResponse) => {
          proxyResponse.headers['Accept-Encoding'] = 'gzip';
        }
      })
    );
  }

  server.get('/auth', async (request, response) => {
    // The library will automatically redirect the user.
    await shopify.auth.begin({
      shop: shopify.utils.sanitizeShop(request.query.shop, true),
      callbackPath: '/auth/callback',
      isOnline: false,
      rawRequest: request,
      rawResponse: response
    });
  });

  server.get('/auth/callback', async (request, response) => {
    // The library will automatically set the appropriate HTTP headers
    const callbackResponse = await shopify.auth.callback({
      rawRequest: request,
      rawResponse: response
    });

    const { shop: shopDomain, accessToken } = callbackResponse.session;
    const shop = await shopsServiceHttpClient.post(
      `/shops/domain/${shopDomain}/initialization`,
      { accessToken }
    );
    const shopId = shop._id;

    // Set up a billing plan immediately.
    const { redirectUrl } = await shopsServiceHttpClient.post(
      `/shops/${shopId}/plan`,
      {
        level: 'BASIC'
      }
    );

    response.redirect(redirectUrl);
  });

  server.get('/authToken', async (request, response) => {
    try {
      // Get Shopify session token.
      const { shopifySessionToken } = request.query;

      // Extract the shop domain from the session token.
      const decodedToken = jwt.decode(shopifySessionToken);
      const shopUrl = decodedToken.dest;
      const shopDomain = shopUrl.replace('https://', '');

      // Retrieve shop data based on the shop domain.
      const shop = await shopsServiceHttpClient.get(
        `/shops/domain/${shopDomain}`
      );
      const shopId = shop._id;

      // Reference: https://shopify.dev/apps/auth/oauth/session-tokens/getting-started#optional-obtain-session-details-and-verify-the-session-token-manually
      const tokenIsValid = verifySessionToken(
        shopifySessionToken,
        SHOPIFY_ADMIN_APP_API_SECRET_KEY,
        SHOPIFY_ADMIN_APP_API_KEY
      );

      // Create a signed auth token.
      const authToken = jwt.sign({ shopId }, JWT_SECRET);

      if (!tokenIsValid) {
        response
          .status(StatusCodes.UNAUTHORIZED)
          .send(ReasonPhrases.UNAUTHORIZED);
        return;
      }

      if (!shop.accessToken) {
        response
          .status(StatusCodes.UNAUTHORIZED)
          .send(ReasonPhrases.UNAUTHORIZED);
        return;
      }

      // Return the auth token.
      response.set('Content-Type', 'application/json');
      response.send(JSON.stringify({ authToken }));
    } catch (error) {
      response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  });

  server.get('/', async (request, response) => {
    const { shop: shopDomain } = request.query;
    const shop = await shopsServiceHttpClient.get(
      `/shops/domain/${shopDomain}`
    );

    if (!shop || !shop.active) {
      response.redirect(`/auth?shop=${shopDomain}`);
    } else {
      response.set(
        'Content-Security-Policy',
        `frame-ancestors https://${shopDomain} https://admin.shopify.com`
      );
      await handleAppRequest(request, response);
    }
  });

  server.use(express.static(path.join(__dirname, '../../public')));
  server.use('/_next', express.static(path.join(__dirname, '../../.next')));
  server.get('/_next/webpack-hmr', handleAppRequest);
  server.get('*', handleAppRequest);

  return server;
};

if (dev) {
  app.prepare().then(() => {
    createServer().listen(port, () => {
      console.info(`Shopify Admin app running at http://localhost:${port}`); // eslint-disable-line no-console
    });
  });
}

const serverlessHandler = serverless(createServer());

module.exports.handler = async (event, context) => {
  if (event.source === 'serverless-plugin-warmup') {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  return await serverlessHandler(event, context);
};
