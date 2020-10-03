const calculateRevenueIncrease = (offerHit) => {
  const { strategy } = offerHit;
  let {
    originalShopifyProductVariantPrice,
    acceptedShopifyProductVariantPrice,
    acceptedShopifyProductQuantity
  } = offerHit;
  let revenueIncrease = 0;

  // Default values used in calculations to zero in case they have bad values.
  originalShopifyProductVariantPrice = originalShopifyProductVariantPrice || 0;
  acceptedShopifyProductVariantPrice = acceptedShopifyProductVariantPrice || 0;
  acceptedShopifyProductQuantity = acceptedShopifyProductQuantity || 0;

  if (strategy === 'UPSELL') {
    // A comparable, more expensive product was purchased, so calculate the increase in price.
    revenueIncrease =
      acceptedShopifyProductVariantPrice - originalShopifyProductVariantPrice ||
      0;
  } else if (strategy === 'CROSS_SELL') {
    // A related or complimentary product was purchased, so calculate the additional price.
    revenueIncrease = acceptedShopifyProductVariantPrice || 0;
  }

  // Account for quantity purchased.
  revenueIncrease *= acceptedShopifyProductQuantity;

  return revenueIncrease;
};

module.export = calculateRevenueIncrease;
