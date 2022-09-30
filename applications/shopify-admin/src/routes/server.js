const getenv = require('getenv');
const serverless = require('serverless-http');
const Koa = require('koa');
const Router = require('koa-router');
const connect = require('koa-connect');
const helmet = require('koa-helmet');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');
const shopifyAuth = require('@shopify/koa-shopify-auth').default;
const { default: Shopify, ApiVersion } = require('@shopify/shopify-api');
const HttpClient = require('@greatupsells/gateway-http-client');
const RedisStore = require('../utilities/RedisStore');

const {
  NODE_ENV,
  SHOPIFY_ADMIN_APP_API_KEY,
  SHOPIFY_ADMIN_APP_API_SECRET_KEY,
  SHOPIFY_ADMIN_APP_URL,
  STOREFRONT_PORT,
  SHOPS_API_URL,
  JWT_SECRET,
  REDIS_URL_APP
} = process.env;
const dev = NODE_ENV !== 'production';
const port = getenv.int('SHOPIFY_ADMIN_APP_PORT', 4001);
const app = next({ dev });

const shopsServiceHttpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

const sessionStorage = new RedisStore(REDIS_URL_APP);

Shopify.Context.initialize({
  API_KEY: SHOPIFY_ADMIN_APP_API_KEY,
  API_SECRET_KEY: SHOPIFY_ADMIN_APP_API_SECRET_KEY,
  SCOPES: [
    'read_products',
    'read_orders',
    'read_script_tags',
    'read_draft_orders',
    'write_script_tags',
    'write_draft_orders',
    'read_themes',
    'read_checkouts'
  ],
  HOST_NAME: new URL(SHOPIFY_ADMIN_APP_URL).host,
  API_VERSION: ApiVersion.January22,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.CustomSessionStorage(
    sessionStorage.storeCallback,
    sessionStorage.loadCallback,
    sessionStorage.deleteCallback
  )
});

const createServer = () => {
  const server = new Koa();
  const router = new Router();
  const handle = app.getRequestHandler();

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  // Secure HTTP headers. Disable frameguard so that the app may be embedded within Shopify Admin.
  server.use(helmet({ frameguard: false }));

  // Set up dev proxies.
  if (dev) {
    // Necessary as Shopify script tags must be hosted on a public URL.
    server.use(
      connect(
        createProxyMiddleware('/storefront.js', {
          target: `http://localhost:${STOREFRONT_PORT}`,
          changeOrigin: true
        })
      )
    );

    // Necessary to enable tunneling for themes in storefront.
    server.use(
      connect(
        createProxyMiddleware('/themes', {
          target: `http://localhost:${STOREFRONT_PORT}`,
          changeOrigin: true,
          pathRewrite: { '^/themes': '' }
        })
      )
    );
  }

  server.keys = [Shopify.Context.API_SECRET_KEY];

  server.use(
    shopifyAuth({
      accessMode: 'offline',
      afterAuth: async (ctx) => {
        const { shop: shopDomain, accessToken } = ctx.state.shopify;

        await shopsServiceHttpClient.post(
          `/shops/domain/${shopDomain}/initialization`,
          { accessToken }
        );

        ctx.redirect(`/?shop=${shopDomain}`);
      }
    })
  );

  router.get('/authToken', async (ctx) => {
    try {
      // Get Shopify session token.
      const { shopifySessionToken } = ctx.query;

      // Verify Shopify session token.
      // TODO

      // Extract the shop domain from the session token.
      const shopUrl = jwt.decode(shopifySessionToken).dest;
      const shopDomain = shopUrl.replace('https://', '');

      // Retrieve shop data based on the shop domain.
      const shop = await shopsServiceHttpClient.get(
        `/shops/domain/${shopDomain}`
      );
      const shopId = shop._id;

      // Create a signed auth token.
      const authToken = jwt.sign({ shopId }, JWT_SECRET);

      if (!shop.accessToken) {
        ctx.status = StatusCodes.UNAUTHORIZED;
        ctx.body = ReasonPhrases.UNAUTHORIZED;

        return;
      }

      // Return the auth token.
      ctx.response.set('Content-Type', 'application/json');
      ctx.body = JSON.stringify({ authToken });
    } catch (error) {
      ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
      ctx.body = ReasonPhrases.INTERNAL_SERVER_ERROR;
    }
  });

  router.get('/', async (ctx) => {
    const { shop: shopDomain } = ctx.query;
    const shop = await shopsServiceHttpClient.get(
      `/shops/domain/${shopDomain}`
    );

    if (!shop || !shop.active) {
      ctx.redirect(`/auth?shop=${shopDomain}`);
    } else {
      ctx.response.set(
        'Content-Security-Policy',
        `frame-ancestors https://${shopDomain} https://admin.shopify.com`
      );
      await handleRequest(ctx);
    }
  });

  router.get('(/_next/static/.*)', handleRequest);
  router.get('/_next/webpack-hmr', handleRequest);
  router.get('(.*)', handleRequest);

  server.use(router.allowedMethods());
  server.use(router.routes());

  // Log errors.
  server.on('error', (error) => {
    console.error(error); // eslint-disable-line no-console
  });

  return server;
};

if (dev) {
  app.prepare().then(() => {
    createServer().listen(port, () => {
      console.info(`Shopify Admin app running at http://localhost:${port}`); // eslint-disable-line no-console
    });
  });
}

module.exports.handler = async (event, context) => {
  if (event.source === 'serverless-plugin-warmup') {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  const serverlessHandler = serverless(createServer());

  return serverlessHandler(event, context);
};
