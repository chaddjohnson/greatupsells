const Promise = require('bluebird');
const logger = require('@neatowebsolutions/upselling-logger');

const { COPIED_PRODUCT_IDENTIFIER } = process.env;

const patchHideCopiedProductsFromCollectionDisplay = async (
  shop,
  assetKey,
  assetValue
) => {
  const patched = assetValue.includes(COPIED_PRODUCT_IDENTIFIER);

  // Abort patch if already done.
  if (patched) {
    await logger.info(
      `Aborting theme patch "hideCopiedProductsFromCollectionDisplay" as asset "${assetKey}" is already patched in shop (${shop.toString()})`,
      { assetValue }
    );
    return assetValue;
  }

  return assetValue.replace(
    /([ \t]*)({%-?\s+for\s+product\s+in\s+[^%]+%})/gi,
    `$1$2\n$1  {% if product.type == '${COPIED_PRODUCT_IDENTIFIER}' %}{% continue %}{% endif %}`
  );
};

const patchAsset = async (shop, theme, asset) => {
  const shopifyApiClient = shop.getShopifyApiClient();
  const { key } = asset;

  try {
    // Get the asset value.
    const { value: originalValue } = await shopifyApiClient.asset.get(
      theme.id,
      {
        'asset[key]': key
      }
    );

    // Patch the asset value.
    const newValue = await patchHideCopiedProductsFromCollectionDisplay(
      shop,
      key,
      originalValue
    );

    // Update the asset value if it has changed.
    if (originalValue !== newValue) {
      await logger.info(
        `Patching asset "${key}" for shop (${shop.toString()})`,
        { originalValue, newValue }
      );
      await shopifyApiClient.asset.update(theme.id, { key, value: newValue });
    }
  } catch (error) {
    await logger.error(
      `Error patching asset "${key}" for shop "${shop.toString()}"`,
      error
    );
  }
};

const updateShopifyTheme = async (shop) => {
  await logger.info(`Updating shop theme (${shop.toString()})`);

  const shopifyApiClient = shop.getShopifyApiClient();

  // Find the published theme.
  const [theme] = await shopifyApiClient.theme.list({ role: 'main' });
  const assets = await shopifyApiClient.asset.list(theme.id);

  // Filter for only Liquid assets.
  const liquidAssets = assets.filter(
    ({ key, content_type: contentType }) =>
      key.match(/\.liquid$/) || contentType === 'text/x-liquid'
  );

  // Patch assets as needed.
  await Promise.map(
    liquidAssets,
    async (asset) => patchAsset(shop, theme, asset),
    {
      concurrency: 5
    }
  );
};

module.exports = updateShopifyTheme;
