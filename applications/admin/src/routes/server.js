const getenv = require('getenv');
const serverless = require('serverless-http');
const Koa = require('koa');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const port = getenv.int('ADMIN_APP_PORT', 4001);
const server = new Koa();
const app = next({ dev });
const handle = app.getRequestHandler();

server.use(async (ctx) => {
  await handle(ctx.req, ctx.res);
  ctx.respond = false;
  ctx.res.statusCode = 200;
});

server.on('error', (error) => {
  console.log(error); // eslint-disable-line no-console
});

if (dev) {
  app.prepare().then(() => {
    server.listen(port, () => {
      console.info(`Admin app running at http://localhost:${port}`); // eslint-disable-line no-console
    });
  });
} else {
  module.exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    if (event.source === 'serverless-plugin-warmup') {
      console.log('WarmUp - Lambda is warm!');
      await new Promise((resolve) => setTimeout(resolve, 25));
      return 'Lambda is warm!';
    }

    const serverlessHandler = serverless(server);

    return serverlessHandler(event, context);
  };
}
