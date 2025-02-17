const toString = (collection) => {
  const { shop } = collection;
  const title = collection.shopifyCollectionData && collection.shopifyCollectionData.title;
  const data = [];

  data.push(`Collection ID = ${collection.id}`);
  data.push(`Shopify Shop ID = ${collection.shopifyShopId}`);
  data.push(`Shopify Collection ID = ${collection.shopifyCollectionId}`);
  data.push(`Name = ${title}`);

  if (shop) {
    data.push(`Shop = ${shop.domain}`);
  }

  return data.join(' | ');
};

module.exports = toString;
