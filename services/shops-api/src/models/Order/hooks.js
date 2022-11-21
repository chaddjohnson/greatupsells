const preValidate = (order, next) => {
  const { shopifyOrderData } = order;

  order.shopifyOrderNumber = shopifyOrderData.order_number;

  next();
};

module.exports.preValidate = preValidate;
