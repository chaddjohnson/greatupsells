const ShopifyApiNode = require('shopify-api-node');

module.exports = (shop) => {
  const { domain, accessToken } = shop;
  const autoLimit = { calls: 1, interval: 1000, bucketSize: 13 };
  const timeout = 2 * 60 * 1000; // 2 minutes
  const apiVersion = '2022-10';

  if (!accessToken) {
    throw new Error(`No access token available for shop ${domain}`);
  }

  const shopName = domain.replace(/^([^\.]+).*$/, '$1');

  return new ShopifyApiNode({
    shopName,
    accessToken,
    autoLimit,
    timeout,
    apiVersion
  });
};
