const ShopifyApiNode = require('shopify-api-node');

const clientCache = {};

module.exports = (shop) => {
  const { domain, accessToken } = shop;
  const autoLimit = { calls: 1, interval: 1000, bucketSize: 13 };
  const timeout = 2 * 60 * 1000; // 2 minutes
  const apiVersion = '2022-10';

  if (clientCache[domain]) {
    return clientCache[domain];
  }

  if (!accessToken) {
    throw new Error(`No access token available for shop ${domain}`);
  }

  const shopName = domain.replace(/^([^\.]+).*$/, '$1');
  const client = new ShopifyApiNode({
    shopName,
    accessToken,
    autoLimit,
    timeout,
    apiVersion
  });

  clientCache[domain] = client;

  return client;
};
