module.exports = async (product, next) => {
  product.title = product.shopifyProductData.title;

  next();
};
