const toString = function (shop) {
  const data = [];

  data.push(`ID = ${shop.id}`);
  data.push(`Shopify Shop ID = ${shop.shopifyShopId}`);
  data.push(`Shopify Product ID = ${shop.shopifyProductId}`);

  if (shop.shop) {
    data.push(`Shop = ${shop.shop.domain}`);
  }

  return data.join(' | ');
};

module.exports = toString;
