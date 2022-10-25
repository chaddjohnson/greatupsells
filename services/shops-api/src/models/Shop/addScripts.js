const logger = require('@greatupsells/logger');

const addScripts = async (shop) => {
  // Use proxy URL defined in app settings within Shopify Partners account.
  const src = `https://${shop.domain}/tools/great-upsells-assets/storefront.js`;

  const shopifyApiClient = shop.getShopifyApiClient();
  const scriptTags = await shopifyApiClient.scriptTag.list();
  const existingScriptTag = scriptTags.find(
    (scriptTag) => scriptTag.src === src
  );

  if (!existingScriptTag) {
    await shopifyApiClient.scriptTag.create({
      event: 'onload',
      src,
      display_scope: 'order_status', // only load on Order Status and Thank You pages
      cache: false
    });

    await logger.info(`Added script tag for shop (${shop.toString()})`, {
      src
    });
  }
};

module.exports = addScripts;
