const toString = (offer) => {
  const { shop } = offer;
  const data = [];

  data.push(`ID = ${offer.id}`);
  data.push(`Name = ${offer.name}`);
  data.push(`Shopify Shop ID = ${offer.shopifyShopId}`);

  if (shop) {
    data.push(`Shop = ${shop.domain}`);
  }

  return data.join(' | ');
};

module.exports = toString;
