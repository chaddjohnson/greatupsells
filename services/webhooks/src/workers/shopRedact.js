const { createWorker } = require('../lib/worker');

const handler = createWorker(async (event) => {
  const { shop_id, shop_domain } = JSON.parse(event.body);
  
  // TODO: Implement your shop data deletion logic here
  // You should delete or anonymize all data associated with this shop
  
  console.log('Processing shop redaction request', {
    shop_id,
    shop_domain
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Shop redaction request received and being processed' })
  };
});

module.exports = { handler }; 