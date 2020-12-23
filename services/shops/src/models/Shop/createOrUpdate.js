const logger = require('@neatowebsolutions/upselling-logger');
const mongodbClient = require('../mongodbClient');

const createShop = async (shopDomain, accessToken) => {
  const Shop = mongodbClient.connection.model('Shop');
  const shop = new Shop({ domain: shopDomain, accessToken });
  const shopifyApiClient = shop.getShopifyApiClient();
  const shopifyShopData = await shopifyApiClient.shop.get();

  shop.shopifyShopId = shopifyShopData.id;
  shop.name = shopifyShopData.name;
  shop.contactName = shopifyShopData.shop_owner;
  shop.contactEmail = shopifyShopData.email;
  shop.contactPhone = shopifyShopData.phone;
  shop.countryCode = shopifyShopData.country_code;
  shop.currency = shopifyShopData.currency;
  shop.locale = shopifyShopData.primary_locale;
  shop.timezone = shopifyShopData.iana_timezone;
  shop.shopifyPlan = shopifyShopData.plan_name;

  if (shopifyShopData.domain !== shopifyShopData.myshopify_domain) {
    shop.alternateDomain = shopifyShopData.domain;
  }

  await shop.save();

  logger.info(`Created new shop (${shop.toString()})`);

  return shop;
};

const createOrUpdateShop = async (shopDomain, accessToken) => {
  const Shop = mongodbClient.connection.model('Shop');
  let shop = await Shop.findByDomain(shopDomain);

  try {
    if (!shop) {
      shop = await createShop(shopDomain, accessToken);
    }

    if (accessToken) {
      logger.info(
        `Updating access token to ${accessToken} for shop ${shopDomain}`
      );

      // Set/update the access token for the shop.
      shop.accessToken = accessToken;
    } else {
      logger.warn(
        `Attempted to update shop access token with empty token for shop ${shopDomain}`
      );
    }

    // Mark the shop as no longer uninstalled (in case this app was uninstalled and reinstalled).
    shop.uninstalledAt = undefined;

    // Mark the shop as active.
    shop.active = true;

    await shop.save();
  } catch (error) {
    logger.info(`Error creating new shop ${shopDomain}`, error);

    throw error;
  }

  try {
    // Run various initializations for the shop.
    await shop.initialize();
  } catch (error) {
    logger.info(`Error initializing shop (${shop.toString()})`, error);

    throw error;
  }

  return shop;
};

module.exports = createOrUpdateShop;
