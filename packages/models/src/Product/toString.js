const toString = (product) => {
  const { shop } = product;
  const data = [];

  data.push(`ID = ${product.id}`);
  data.push(`Shopify Shop ID = ${product.shopifyShopId}`);
  data.push(`Shopify Product ID = ${product.shopifyProductId}`);

  if (shop) {
    data.push(`Shop = ${shop.domain}`);
  }

  return data.join(' | ');
};

module.exports = toString;
