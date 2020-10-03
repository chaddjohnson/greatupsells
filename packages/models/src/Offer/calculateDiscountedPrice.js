const calculateDiscountedPrice = (offer, price) => {
  let discountedPrice = price;

  switch (offer.discountType) {
    case 'PERCENTAGE':
      // Reduce the price by the discount amount (a percentage).
      discountedPrice = price * offer.discountAmount;
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

  // Safeguard against the calculated price being below zero.
  if (discountedPrice < 0) {
    discountedPrice = 0;
  }

  return discountedPrice;
};

module.exports = calculateDiscountedPrice;
