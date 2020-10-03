const toString = (offer) => {
  const data = [];

  data.push(`ID = ${offer.id}`);
  data.push(`Name = ${offer.name}`);
  data.push(`Shopify Shop ID = ${offer.shopifyShopId}`);

  if (offer.shop) {
    data.push(`Shop = ${offer.shop.domain}`);
  }

  return data.join(' | ');
};

module.exports = toString;
