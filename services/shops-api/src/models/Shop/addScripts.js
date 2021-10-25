const logger = require('@greatupsellslogger');

const { ASSETS_URL } = process.env;

const addScripts = async (shop) => {
  const src = `${ASSETS_URL}/storefront.js`;
  const shopifyApiClient = shop.getShopifyApiClient();
  const scriptTags = await shopifyApiClient.scriptTag.list();
  const existingScriptTag = scriptTags.find(
    (scriptTag) => scriptTag.src === src
  );

  if (!existingScriptTag) {
    await shopifyApiClient.scriptTag.create({
      event: 'onload',
      src,
      display_scope: 'all'
    });

    await logger.info(`Added script tag for shop (${shop.toString()})`, {
      src
    });
  }
};

module.exports = addScripts;
