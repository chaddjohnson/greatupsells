const { createWorker } = require('../lib/worker');

const handler = createWorker(async (event) => {
  const { shop_id, shop_domain, customer, orders_requested } = JSON.parse(event.body);
  
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

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Data request received and being processed' })
  };
});

module.exports = { handler }; 