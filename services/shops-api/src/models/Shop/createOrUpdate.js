const getenv = require('getenv');
const logger = require('@greatupsells/logger');
const models = require('..');

const isSandbox = getenv.bool('SANDBOX', true);

const createShop = async (shopDomain, accessToken) => {
  const Shop = await models.get('Shop');
  const shop = new Shop({ domain: shopDomain, accessToken });
  const shopifyApiClient = shop.getShopifyApiClient();
  const shopifyShopData = await shopifyApiClient.shop.get();

  shop.shopifyShopData = shopifyShopData;

  await shop.save();
  await logger.info(`Created new shop (${shop.toString()})`);

  return shop;
};

const createOrUpdate = async (shopDomain, accessToken) => {
  const Shop = await models.get('Shop');
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

  // Set a fake plan under sandbox mode as Shopify disallows recurring application
  // charge access for custom apps.
  if (isSandbox) {
    shop.plan = {
      name: 'Pro',
      level: 'PRO',
      price: 99,
      active: true,
      chargeId: 1234567890,
      billingOn: new Date(),
      startedAt: new Date(),
      trialStarteDate: new Date(),
      monthUpsellRevenue: 0
    };
  }

  await shop.save();

  // Run various initializations for the shop.
  await shop.initialize();

  return shop;
};

module.exports = createOrUpdate;
