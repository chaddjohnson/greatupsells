const getenv = require('getenv');
const serverless = require('serverless-http');
const Koa = require('koa');
const Router = require('koa-router');
const connect = require('koa-connect');
const session = require('koa-session');
const helmet = require('koa-helmet');
const jwt = require('jsonwebtoken');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');
const {
  default: shopifyAuth,
  verifyRequest
} = require('@shopify/koa-shopify-auth');
const { aws4Interceptor } = require('aws4-axios');
const HttpClient = require('@neatowebsolutions/upselling-http-client').default;

const dev = process.env.NODE_ENV !== 'production';
const port = getenv.int('SHOPIFY_ADMIN_APP_PORT', 4001);
const app = next({ dev });
const handle = app.getRequestHandler();

const {
  AWS_REGION,
  SHOPIFY_ADMIN_APP_API_KEY,
  SHOPIFY_ADMIN_APP_API_SECRET_KEY,
  SHOPIFY_ADMIN_APP_URL,
  STOREFRONT_PORT,
  JWT_SECRET,
  SHOPS_API_URL
} = process.env;

const shopsServiceHttpClient = new HttpClient({
  baseUrl: SHOPS_API_URL
});

shopsServiceHttpClient.addRequestInterceptor(
  aws4Interceptor({
    region: AWS_REGION,
    service: 'execute-api'
  })
);

const createServer = () => {
  const server = new Koa();
  const router = new Router();

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.get('(/_next/static/.*)', handleRequest);
  router.get('/_next/webpack-hmr', handleRequest);
  router.get('(.*)', verifyRequest({ accessMode: 'offline' }), handleRequest);

  // Secure HTTP headers. Disable frameguard so that the app may be embedded within Shopify Admin.
  server.use(helmet({ frameguard: false }));

  // Set up dev proxies.
  if (dev) {
    server.use(
      connect(
        createProxyMiddleware('/storefront.js', {
          target: `http://localhost:${STOREFRONT_PORT}`,
          changeOrigin: true
        })
      )
    );
  }

  // Initialize Shopify OAuth support.
  server.use(
    session({ httpOnly: true, secure: true, sameSite: 'None' }, server)
  );
  server.keys = [SHOPIFY_ADMIN_APP_API_SECRET_KEY];
  server.use(
    shopifyAuth({
      prefix: dev ? SHOPIFY_ADMIN_APP_URL : '',
      apiKey: SHOPIFY_ADMIN_APP_API_KEY,
      secret: SHOPIFY_ADMIN_APP_API_SECRET_KEY,
      scopes: [
        'read_products',
        'read_orders',
        'read_script_tags',
        'read_draft_orders',
        'write_script_tags',
        'write_draft_orders'
      ],
      accessMode: 'offline',
      afterAuth: async (ctx) => {
        const { shop: shopDomain, accessToken } = ctx.session;
        const shop = await shopsServiceHttpClient.post(
          `/shops/domain/${shopDomain}/initialization`,
          { accessToken }
        );
        const shopId = shop._id;
        const authToken = jwt.sign({ shopId }, JWT_SECRET);

        ctx.cookies.set('shopOrigin', shopDomain, {
          httpOnly: false,
          sameSite: 'None',
          secure: true
        });
        ctx.cookies.set('authToken', authToken, {
          httpOnly: false,
          sameSite: 'None',
          secure: true
        });

        ctx.redirect('/');
      }
    })
  );
  server.use(router.allowedMethods());
  server.use(router.routes());

  // Log errors.
  server.on('error', (error) => {
    console.log(error); // eslint-disable-line no-console
  });

  return server;
};
const server = createServer();

if (dev) {
  app.prepare().then(() => {
    server.listen(port, () => {
      console.info(`Shopify Admin app running at http://localhost:${port}`); // eslint-disable-line no-console
    });
  });
} else {
  module.exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    if (event.source === 'serverless-plugin-warmup') {
      await new Promise((resolve) => setTimeout(resolve, 25));
      return 'Lambda is warm!';
    }

    const serverlessHandler = serverless(server);

    return serverlessHandler(event, context);
  };
}
