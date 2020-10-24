const topLevelRouter = require('./routes');
const shopifyRouter = require('./routes/shopify');

const init = (app) => {
  topLevelRouter.init(app);
  shopifyRouter.init(app);
};

module.exports.init = init;
