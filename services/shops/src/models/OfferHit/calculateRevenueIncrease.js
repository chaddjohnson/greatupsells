const calculateRevenueIncrease = (offerHit) => {
  const { strategy } = offerHit;
  let {
    originalShopifyVariantPrice,
    acceptedShopifyVariantPrice,
    acceptedShopifyProductQuantity
  } = offerHit;
  let revenueIncrease = 0;

  // Default values used in calculations to zero in case they have bad values.
  originalShopifyVariantPrice = originalShopifyVariantPrice || 0;
  acceptedShopifyVariantPrice = acceptedShopifyVariantPrice || 0;
  acceptedShopifyProductQuantity = acceptedShopifyProductQuantity || 0;

  if (strategy === 'UPSELL') {
    // A comparable, more expensive product was purchased, so calculate the increase in price.
    revenueIncrease =
      acceptedShopifyVariantPrice - originalShopifyVariantPrice || 0;
  } else if (strategy === 'CROSS_SELL') {
    // A related or complimentary product was purchased, so calculate the additional price.
    revenueIncrease = acceptedShopifyVariantPrice || 0;
  }

  // Account for quantity purchased.
  revenueIncrease *= acceptedShopifyProductQuantity;

  return revenueIncrease;
};

module.export = calculateRevenueIncrease;
