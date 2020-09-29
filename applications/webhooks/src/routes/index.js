const httpStatus = require('http-status-codes');
const health = require('./health');

const init = (app) => {
  const router = app;

  router.get('/', (request, response) => {
    response.status(httpStatus.OK).end();
  });

  router.get('/health', health);
};

module.exports.init = init;
