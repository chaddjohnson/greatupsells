const { createAdminApiClient } = require('@shopify/admin-api-client');

module.exports = (shop) => {
  const { domain, accessToken } = shop;

  if (!accessToken) {
    throw new Error(`No access token available for shop ${domain}`);
  }

  // See https://github.com/Shopify/shopify-app-js/tree/159ffbaac410c2be56913770520e9acaf145f190/packages/api-clients/admin-api-client#graphql-client
  const client = createAdminApiClient({
    storeDomain: domain,
    apiVersion: '2025-01',
    accessToken,
    retries: 3
  });

  return client;
};
