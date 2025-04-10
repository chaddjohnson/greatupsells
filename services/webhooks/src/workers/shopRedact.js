const { handle } = require('../lib/worker');

const processor = async ({ shop_id, shop_domain }) => {
  // TODO: Implement your shop data deletion logic here
  // You should delete or anonymize all data associated with this shop
  console.log('Processing shop redaction request', {
    shop_id,
    shop_domain
  });
};

const handler = async (event, context) => {
  return await handle(event, context, processor);
};

module.exports.handler = handler;