const { handle } = require('../lib/worker');

const processor = async ({ shop_id, shop_domain, customer, orders_to_redact }) => {
  // TODO: Implement your data deletion logic here
  // You should delete or anonymize all data associated with this customer
  
  console.log('Processing customer redaction request', {
    shop_id,
    shop_domain,
    customer_id: customer.id,
    customer_email: customer.email,
    orders: orders_to_redact.map(order => order.id)
  });
};

const handler = async (event, context) => {
  return await handle(event, context, processor);
};

module.exports.handler = handler;