const toString = (shop) => {
  const data = [];

  data.push(`ID = ${shop.id}`);
  data.push(`Shopify Shop ID = ${shop.shopifyShopId}`);
  data.push(`Name = ${shop.name}`);
  data.push(`Domain = ${shop.domain}`);

  return data.join(' | ');
};

module.exports = toString;
