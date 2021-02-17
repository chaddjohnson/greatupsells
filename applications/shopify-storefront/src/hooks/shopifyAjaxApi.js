import { useEffect } from 'react';

let productAddedCallbacks = [];

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

  const onProductAddedToShopifyCart = (callback) => {
    productAddedCallbacks.push(callback);

    return () => {
      productAddedCallbacks = productAddedCallbacks.filter(
        (productAddedCallback) => productAddedCallback !== callback
      );
    };
  };

  // Intercept HTTP requests.
  useEffect(() => {
    const originalOpen = window.XMLHttpRequest.prototype.open;

    window.XMLHttpRequest.prototype.open = function (method, url, ...params) {
      const request = this;

      // Intercept Shopify's add to cart event responses.
      if (url === '/cart/add.js') {
        request.addEventListener('load', () => {
          const addedProduct = JSON.parse(request?.responseText || {});

          productAddedCallbacks.forEach((callback) =>
            callback.call(callback, addedProduct)
          );
        });
      }

      return originalOpen.apply(this, [method, url, ...params]);
    };

    return () => {
      window.XMLHttpRequest.prototype.open = originalOpen;
    };
  }, []);

  return {
    fetchShopifyCart,
    addProductToShopifyCart,
    onProductAddedToShopifyCart
  };
};

export default useShopifyAjaxApi;
