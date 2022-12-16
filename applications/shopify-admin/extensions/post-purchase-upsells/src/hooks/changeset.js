const STOREFRONT_API_URL = process.env.STOREFRONT_API_URL; // eslint-disable-line prefer-destructuring

const buildDiscount = (offer, variant) => {
  const { price } = variant;
  let value = 0;
  let valueType = 'fixed_amount';
  const title = `${variant.title} (${offer.discountTitle || 'Discount'})`;

  if (offer && offer.discountType === 'PERCENTAGE') {
    value = offer.discountValue * 100;
    valueType = 'percentage';
  } else if (offer && offer.discountType === 'AMOUNT') {
    value = offer.discountValue;
    valueType = 'fixed_amount';
  } else if (offer && offer.discountType === 'SET_PRICE') {
    value = price - offer.discountValue;
    valueType = 'fixed_amount';
  }

  return { value, valueType, title };
};

const useChangeset = () => {
  const buildChange = (offer, variant, quantity) => {
    const type = 'add_variant';
    const variantId = variant.id;
    const discount = buildDiscount(offer, variant);
    const change = { type, variantId, quantity, discount };

    return change;
  };

  const calculateSubtotalPrice = (calculatedPurchase) => {
    const presentmentAmount = calculatedPurchase?.updatedLineItems.reduce(
      (sum, line) => {
        const amount =
          parseFloat(line.totalPriceSet?.presentmentMoney?.amount) || 0;

        return sum + amount;
      },
      0
    );
    const presentmentCurrency =
      calculatedPurchase?.updatedLineItems[0]?.priceSet?.presentmentMoney
        ?.currencyCode;

    return [presentmentAmount, presentmentCurrency];
  };

  const calculateShippingPrice = (calculatedPurchase) => {
    const presentmentAmount = calculatedPurchase?.addedShippingLines.reduce(
      (sum, line) => {
        const amount = parseFloat(line.priceSet?.presentmentMoney?.amount) || 0;

        return sum + amount;
      },
      0
    );
    const presentmentCurrency =
      calculatedPurchase?.addedShippingLines[0]?.priceSet?.presentmentMoney
        ?.currencyCode;

    return [presentmentAmount, presentmentCurrency];
  };

  const calculateTaxPrice = (calculatedPurchase) => {
    const presentmentAmount = calculatedPurchase?.addedTaxLines.reduce(
      (sum, line) => {
        const amount = parseFloat(line.priceSet?.presentmentMoney?.amount) || 0;

        return sum + amount;
      },
      0
    );
    const presentmentCurrency =
      calculatedPurchase?.addedTaxLines[0]?.priceSet?.presentmentMoney
        ?.currencyCode;

    return [presentmentAmount, presentmentCurrency];
  };

  const calculateTotalPrice = (calculatedPurchase) => {
    const presentmentAmount =
      calculatedPurchase?.totalOutstandingSet.presentmentMoney.amount;
    const presentmentCurrency =
      calculatedPurchase?.totalOutstandingSet.presentmentMoney.currencyCode;

    return [presentmentAmount, presentmentCurrency];
  };

  const signChangeset = async (referenceId, changes, token) => {
    const url = `${STOREFRONT_API_URL}/post-purchase/changeset-signature`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referenceId, changes, token })
    });
    const { token: changesetToken } = await response.json();

    return changesetToken;
  };

  return {
    buildChange,
    calculateSubtotalPrice,
    calculateShippingPrice,
    calculateTaxPrice,
    calculateTotalPrice,
    signChangeset
  };
};

export default useChangeset;
