const toString = (collection) => {
  const data = [];
  const title =
    collection.shopifyCollectionData && collection.shopifyCollectionData.title;

  data.push(`ID = ${collection.id}`);
  data.push(`Shopify Shop ID = ${collection.shopifyShopId}`);
  data.push(`Name = ${title}`);

  return data.join(' | ');
};

module.exports = toString;
