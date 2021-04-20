const calculateDiscountedPrice = (offer, price) => {
  // Shopify stores prices as strings. Ensure it is a number here.
  price = parseFloat(price);

  if (!offer) {
    throw new Error('`offer` must be provided');
  }
  if (typeof price !== 'number' || Number.isNaN(price)) {
    throw new Error('`price` must be a number');
  }

  let discountedPrice = price;

  switch (offer.discountType) {
    case 'PERCENTAGE':
      // Reduce the price by the discount amount (a percentage).
      discountedPrice = price - price * offer.discountAmount;
      break;

    case 'USD':
      // Reduce the price by the discount amount (a monetary amount).
      discountedPrice = price - offer.discountAmount;
      break;

    case 'SET_PRICE':
      // Use the discount amount as the price.
      discountedPrice = offer.discountAmount;
      break;

    case 'NO_DISCOUNT':
    default:
      // No discount, so adjust nothing.
      break;
  }

  // Round price. Reference: https://stackoverflow.com/a/11832950/83897.
  discountedPrice = Math.round((discountedPrice + Number.EPSILON) * 100) / 100;

  // Safeguard against the calculated price being negative.
  return Math.max(discountedPrice, 0);
};

module.exports = calculateDiscountedPrice;
