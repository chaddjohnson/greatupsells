import { useState, useCallback, useEffect } from 'react';

const XMLHttpRequest = typeof window !== 'undefined' && window.XMLHttpRequest;
const originalOpen = XMLHttpRequest?.prototype?.open;

// Listeners must be module-level because XMLHttpRequest is global.
const listeners = [];

const useHttpRequestListener = (listenerUrl, listener) => {
  const [listenerAdded, setListenerAdded] = useState(false);

  if (listener && !listenerAdded) {
    listeners.push(listener);
    setListenerAdded(true);
  }

  const handleRequest = useCallback((request) => {
    listeners.forEach((current) => current.call(current, request));
  }, []);

  useEffect(() => {
    XMLHttpRequest.prototype.open = function (method, url, ...params) {
      const request = this;

      // Intercept Shopify's add to cart event responses.
      if (url === listenerUrl) {
        request.addEventListener('load', () => handleRequest(request));
      }

      return originalOpen.apply(this, [method, url, ...params]);
    };

    return () => {
      XMLHttpRequest.prototype.open = originalOpen;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useHttpRequestListener;
