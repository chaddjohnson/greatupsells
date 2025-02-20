const { handle } = require('../lib/worker');

const processor = async ({ shop_id, shop_domain, customer, orders_requested }) => {
  // TODO: Implement your data gathering logic here
  // You should collect all data associated with this customer
  // and provide it to the merchant through your preferred method
  console.log('Processing customer data request', {
    shop_id,
    shop_domain,
    customer_id: customer.id,
    customer_email: customer.email,
    orders: orders_requested.map(order => order.id)
  });
};

const handler = async (event, context) => {
  return await handle(event, context, processor);
};

module.exports.handler = handler;