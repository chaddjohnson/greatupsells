module.exports.products = async (root, args, context) => {
  const { Product } = context;
  const product = await Product.find();

  // TODO: Authorization

  return product;
};

module.exports.product = async (root, args, context) => {
  const { Product } = context;
  const product = await Product.findById(args.id);

  // TODO: Authorization

  return product;
};

module.exports.productShop = async (root, args, context) => {
  const { Shop } = context;
  const shop = await Shop.findById(root.shop);

  return shop;
};
