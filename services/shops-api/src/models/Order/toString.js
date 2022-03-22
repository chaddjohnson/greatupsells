const toString = (order) => {
  const { shop } = order;
  const data = [];

  data.push(`Order ID = ${order.id}`);
  data.push(`Shopify Shop ID = ${order.shopifyShopId}`);
  data.push(`Order Number = ${order.orderNumber}`);

  if (shop) {
    data.push(`Shop = ${shop.domain}`);
  }

  return data.join(' | ');
};

module.exports = toString;
