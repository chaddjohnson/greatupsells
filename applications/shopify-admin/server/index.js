const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const getenv = require('getenv');
const Koa = require('koa');
const connect = require('koa-connect');
const session = require('koa-session');
const helmet = require('koa-helmet');
const jwt = require('jsonwebtoken');
const next = require('next');
const serverless = require('serverless-http');
const { createProxyMiddleware } = require('http-proxy-middleware');
const {
  default: createShopifyAuth,
  verifyRequest
} = require('@shopify/koa-shopify-auth');
const { aws4Interceptor } = require('aws4-axios');
const HttpClient = require('@neatowebsolutions/upselling-http-client');

dotenvExpand(dotenv.config());

const port = getenv.int('SHOPIFY_ADMIN_APP_PORT');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const {
  AWS_REGION,
  SHOPIFY_ADMIN_APP_API_KEY,
  SHOPIFY_ADMIN_APP_API_SECRET_KEY,
  SHOPIFY_ADMIN_APP_STOREFRONT_PORT,
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

  // Secure HTTP headers. Disable frameguard so that the app may be embedded within Shopify Admin.
  server.use(helmet({ frameguard: false }));

  // Set up dev proxies.
  if (dev) {
    server.use(
      connect(
        createProxyMiddleware('/storefront.js', {
          target: `http://localhost:${SHOPIFY_ADMIN_APP_STOREFRONT_PORT}`,
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
    createShopifyAuth({
      apiKey: SHOPIFY_ADMIN_APP_API_KEY,
      secret: SHOPIFY_ADMIN_APP_API_SECRET_KEY,
      scopes: [
        'read_products',
        'read_orders',
        'write_products',
        'read_script_tags',
        'write_script_tags'
      ],
      afterAuth: async (ctx) => {
        const { shop: shopDomain, accessToken } = ctx.session;
        const authToken = jwt.sign({ shopDomain }, JWT_SECRET);

        await shopsServiceHttpClient.post(
          `/shops/domain/${shopDomain}/initialization`,
          { accessToken }
        );

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
  server.use(verifyRequest());
  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });

  return server;
};

if (dev) {
  app.prepare().then(() => {
    createServer().listen(port, () =>
      // eslint-disable-next-line no-console
      console.info(`Running at http://localhost:${port}`)
    );
  });
} else {
  module.exports.handler = serverless(createServer());
}
