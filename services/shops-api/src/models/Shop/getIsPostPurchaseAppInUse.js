module.exports = async (shop) => {
  const shopifyApiClient = shop.getShopifyApiClient();
  const appData = await shopifyApiClient.graphql(`{
    app  {
        isPostPurchaseAppInUse
    }
  }`);
  const { isPostPurchaseAppInUse } = appData.app;

  return isPostPurchaseAppInUse;
};
