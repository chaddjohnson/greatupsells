const STOREFRONT_API_URL = process.env.STOREFRONT_API_URL; // eslint-disable-line prefer-destructuring

const loadShop = async (domain) => {
  const url = `${STOREFRONT_API_URL}/shop`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      shop: `https://${domain}`
    }
  });
  const shop = await response.json();

  return shop;
};

const getShopifyCart = (initialPurchase) => {
  const shopifyCartItems =
    initialPurchase.lineItems.map((lineItem) => ({
      product_id: lineItem.product.id,
      variant_id: lineItem.product.variant.id,
      quantity: lineItem.quantity
    })) || [];
  const shopifyCartTotal = initialPurchase.lineItems.reduce((sum, lineItem) => {
    return sum + parseFloat(lineItem.totalPriceSet.shopMoney.amount);
  }, 0);
  const shopifyCartItemCount = shopifyCartItems.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);
  const shopifyProductIds = shopifyCartItems.map((item) => item.product_id);
  const shopifyVariantIds = shopifyCartItems.map((item) => item.variant_id);

  return {
    shopifyCartItems,
    shopifyCartTotal,
    shopifyCartItemCount,
    shopifyProductIds,
    shopifyVariantIds
  };
};

const loadOffer = async (domain, shopifyCart) => {
  const events = ['LOAD'];
  const url = `${STOREFRONT_API_URL}/offers/random`;
  const {
    shopifyCartTotal,
    shopifyCartItemCount,
    shopifyProductIds,
    shopifyVariantIds
  } = shopifyCart;
  const data = {
    events,
    shopifyProductIds,
    shopifyVariantIds,
    shopifyCartTotal,
    shopifyCartItemCount
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      shop: `https://${domain}`
    },
    body: JSON.stringify(data)
  });
  const [offerData] = await response.json();

  return offerData;
};

const loadData = async (domain, initialPurchase) => {
  const shopifyCart = getShopifyCart(initialPurchase);
  const [shop, offerData] = await Promise.all([
    loadShop(domain),
    loadOffer(domain, shopifyCart)
  ]);

  return {
    shop,
    ...offerData,
    ...shopifyCart
  };
};

export default loadData;
