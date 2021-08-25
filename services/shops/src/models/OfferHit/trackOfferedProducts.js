const trackOfferedProducts = async (offerHit, shopifyProductIds = []) => {
  const productCount = shopifyProductIds.length;

  // Track the viewed product data for the offer hit.
  offerHit.offeredProducts = [...Array(productCount)].map((_, index) => ({
    shopifyProductId: shopifyProductIds[index]
  }));

  offerHit.markModified('offeredProducts');

  await offerHit.save();
};

module.exports = trackOfferedProducts;
