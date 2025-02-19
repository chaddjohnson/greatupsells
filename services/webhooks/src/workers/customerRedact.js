const { createWorker } = require('../lib/worker');

const handler = createWorker(async (event) => {
  const { shop_id, shop_domain, customer, orders } = JSON.parse(event.body);
  
  // TODO: Implement your data deletion logic here
  // You should delete or anonymize all data associated with this customer
  
  console.log('Processing customer redaction request', {
    shop_id,
    shop_domain,
    customer_id: customer.id,
    customer_email: customer.email,
    orders: orders.map(order => order.id)
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Redaction request received and being processed' })
  };
});

module.exports = { handler }; 