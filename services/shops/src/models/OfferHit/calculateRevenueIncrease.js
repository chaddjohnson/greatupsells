const calculateUpsellRevenueIncrease = (offerHit) => {
  const {
    originalShopifyVariantPrices,
    acceptedShopifyVariantPrices,
    acceptedShopifyProductQuantities
  } = offerHit;

  // revenueIncrease =
  //   acceptedShopifyVariantPrice - originalShopifyVariantPrice || 0;

  // Sum all accepted variant prices accounting for quantities.
  return acceptedShopifyVariantPrices.reduce((sum, price, index) => {
    const acceptedPrice = price || 0;
    const originalPrice = originalShopifyVariantPrices[index] || 0;
    const quantity = acceptedShopifyProductQuantities[index] || 0;

    return sum + (acceptedPrice - originalPrice) * quantity;
  }, 0);
};

const calculateCrossSellRevenueIncrease = (offerHit) => {
  const {
    acceptedShopifyVariantPrices,
    acceptedShopifyProductQuantities
  } = offerHit;

  // Sum all accepted variant prices accounting for quantities.
  return acceptedShopifyVariantPrices.reduce((sum, price, index) => {
    const acceptedPrice = price || 0;
    const quantity = acceptedShopifyProductQuantities[index] || 0;

    return sum + acceptedPrice * quantity;
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
