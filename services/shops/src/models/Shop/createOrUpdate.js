const logger = require('@neatowebsolutions/upselling-logger');
const mongodbClient = require('../mongodbClient');

const createShop = async (shopDomain, accessToken) => {
  const Shop = mongodbClient.connection.model('Shop');
  const shop = new Shop({ domain: shopDomain, accessToken });
  const shopifyApiClient = shop.getShopifyApiClient();
  const shopifyShopData = await shopifyApiClient.shop.get();

  shop.shopifyShopData = shopifyShopData;

  await shop.save();
  await logger.info(`Created new shop (${shop.toString()})`);

  return shop;
};

const createOrUpdate = async (shopDomain, accessToken) => {
  const Shop = mongodbClient.connection.model('Shop');
  let shop = await Shop.findOneByDomain(shopDomain);

  if (!shop) {
    shop = await createShop(shopDomain, accessToken);
  }

  if (accessToken) {
    await logger.info(
      `Updating access token to ${accessToken} for shop ${shopDomain}`
    );

    // Set/update the access token for the shop.
    shop.accessToken = accessToken;
  } else {
    await logger.warn(
      `Attempted to update shop access token with empty token for shop ${shopDomain}`
    );
  }

  // Mark the shop as no longer uninstalled (in case this app was uninstalled and reinstalled).
  shop.uninstalledAt = undefined;

  // Mark the shop as active.
  shop.active = true;

  await shop.save();

  // Run various initializations for the shop.
  await shop.initialize();

  return shop;
};

module.exports = createOrUpdate;
