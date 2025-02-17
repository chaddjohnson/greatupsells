const { APP_NAME_SLUG } = process.env;

const getAppEmbedBlock = (settingsData) => {
  const settingsDataBlocks = Object.values(settingsData.current.blocks || {});
  const appEmbedBlockTypePrefix = `shopify://apps/${APP_NAME_SLUG}/blocks/app-embed`;
  const appEmbedBlock = settingsDataBlocks.find((block) => block.type.includes(appEmbedBlockTypePrefix));

  return appEmbedBlock;
};

const getAppEmbedBlockIsInstalledAndEnabled = async (shop) => {
  const shopifyApiClient = shop.getShopifyApiClient();

  // Find the current theme.
  const [theme] = await shopifyApiClient.theme.list({ role: 'main' });
  const shopifyThemeId = theme.id;

  // Determine if the app embed block is installed.
  const settingsData = await shopifyApiClient.asset.get(shopifyThemeId, {
    'asset[key]': 'config/settings_data.json'
  });
  const settingsDataJson = JSON.parse(settingsData.value);
  const appEmbedBlock = getAppEmbedBlock(settingsDataJson);
  const appEmbedBlockIsInstalled = !!appEmbedBlock;
  const appEmbedBlockIsEnabled = !!appEmbedBlock && !appEmbedBlock.disabled;

  return appEmbedBlockIsInstalled && appEmbedBlockIsEnabled;
};

module.exports = getAppEmbedBlockIsInstalledAndEnabled;
