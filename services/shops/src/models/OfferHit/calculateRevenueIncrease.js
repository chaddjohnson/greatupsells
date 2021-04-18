const calculateUpsellRevenueIncrease = (offerHit) => {
  const { originalProducts, acceptedProducts } = offerHit;

  // Sum all accepted variant prices accounting for quantities.
  return acceptedProducts.reduce((sum, acceptedProduct, index) => {
    const acceptedPrice = acceptedProduct.price || 0;
    const originalPrice = originalProducts[index].price || 0;
    const quantity = acceptedProduct.quantity || 0;

    return sum + (acceptedPrice - originalPrice) * quantity;
  }, 0);
};

const calculateCrossSellRevenueIncrease = (offerHit) => {
  const { acceptedProducts } = offerHit;

  // Sum all accepted variant prices accounting for quantities.
  return acceptedProducts.reduce((sum, acceptedProduct) => {
    const price = acceptedProduct.price || 0;
    const quantity = acceptedProduct.quantity || 0;

    return sum + price * quantity;
  }, 0);
};

const calculateRevenueIncrease = (offerHit) => {
  const { strategy } = offerHit;
  let revenueIncrease = 0;

  if (strategy === 'UPSELL') {
    // A comparable, more expensive product was purchased, so calculate the increase in price.
    revenueIncrease = calculateUpsellRevenueIncrease(offerHit);
  } else if (strategy === 'CROSS_SELL') {
    // A related or complimentary product was purchased, so calculate the additional price.
    revenueIncrease = calculateCrossSellRevenueIncrease(offerHit);
  }

  return revenueIncrease;
};

module.export = calculateRevenueIncrease;
