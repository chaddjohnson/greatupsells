const toString = (shop) => {
  const data = [];

  data.push(`Shop ID = ${shop.id}`);
  data.push(`Shopify Shop ID = ${shop.shopifyShopId}`);
  data.push(`Name = ${shop.name}`);
  data.push(`Domain = ${shop.domain}`);

  return data.join(' | ');
};

module.exports = toString;
