const importProducts = async (shop) => {
  const shopProductCount = await shop.getProductCount();

  // Abort import if products have already been imported.
  if (shopProductCount > 1) {
    return;
  }

  // TODO: Enqueue a background worker via SQS.
  // TODO: Ignore or update existing.
  return undefined; // TODO
};

module.exports = importProducts;
