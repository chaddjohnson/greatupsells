import { useEffect } from 'react';

const XMLHttpRequest = typeof window !== 'undefined' && window.XMLHttpRequest;
const originalOpen = XMLHttpRequest?.prototype?.open;
const originalSend = XMLHttpRequest?.prototype?.send;

// Listeners must be module-level because XMLHttpRequest is global.
// Listeners are keyed by URL.
const listeners = {};

XMLHttpRequest.prototype.open = function (method, url, ...params) {
  const request = this;

  // Intercept Shopify's add to cart event responses.
  if (listeners[url]) {
    request.addEventListener('load', () => {
      listeners[url].forEach((current) => {
        current.call(current, request);
      });
    });
  }

  return originalOpen.apply(this, [method, url, ...params]);
};

XMLHttpRequest.prototype.send = function (data) {
  this._data = data;
  return originalSend.call(this, data);
};

const useHttpRequestListener = (listenerUrl, listener) => {
  useEffect(() => {
    if (!listener) {
      return;
    }

    listeners[listenerUrl] = listeners[listenerUrl] || [];
    listeners[listenerUrl].push(listener);

    return () => {
      if (!listeners[listenerUrl]) {
        return;
      }

      const index = listeners[listenerUrl].findIndex(
        (current) => current === listener
      );

      listeners[listenerUrl] = [
        ...listeners[listenerUrl].slice(0, index),
        ...listeners[listenerUrl].slice(index + 1)
      ];
    };
  }, [listenerUrl, listener]);
};

export default useHttpRequestListener;
