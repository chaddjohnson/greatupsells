const checkThemeCompatibility = async (shop) => {
  const shopifyApiClient = shop.getShopifyApiClient();
  const themes = await shopifyApiClient.theme.list();
  const theme = themes.find(({ role }) => role === 'main');

  if (!theme) {
    throw new Error('Cannot find main theme');
  }

  try {
    // Check whether metadata defining app blocks for the Cart page exists.
    await shopifyApiClient.asset.get(theme.id, {
      'asset[key]': 'templates/product.json'
    });

    // Asset exists, so theme is 2.0 compatible.
    shop.onlineStore2Theme = true;
  } catch (error) {
    // Asset does not exist, so theme is 2.0 incompatible.
    shop.onlineStore2Theme = false;
  }

  await shop.save();
};

module.exports = checkThemeCompatibility;
