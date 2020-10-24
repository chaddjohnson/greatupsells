const useShopifyAjaxApi = () => {
  const fetchShopifyCart = async () => {
    const response = await fetch('/cart.js');
    const data = await response.json();

    return data;
  };

  const addProductToShopifyCart = async (variantId, quantity) => {
    await fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          {
            id: variantId,
            quantity
          }
        ]
      })
    });
  };

  return { fetchShopifyCart, addProductToShopifyCart };
};

export default useShopifyAjaxApi;
