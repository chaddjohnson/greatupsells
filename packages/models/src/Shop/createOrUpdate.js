const logger = require('@neatowebsolutions/logger');

const createShop = async (shopDomain, accessToken) => {
  const models = require('..');
  const Shop = await models.get('Shop');
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
  const models = require('..');
  const Shop = await models.get('Shop');
  let shop = await Shop.findByDomain(shopDomain);

  try {
    if (!shop) {
      shop = await createShop(shopDomain, accessToken);
    }

    if (accessToken) {
      logger.info(
        `Updating access token to ${accessToken} for shop ${shopDomain}`
      );
    } else {
      logger.warn(
        `Attempted to update shop access token with empty token for shop ${shopDomain}`
      );
    }

    // Use one round trip to prevent write conflicts.
    await Shop.findByIdAndUpdate(shop.id, {
      // Update the access token if one is provided.
      accessToken: accessToken || shop.accessToken,

      // Mark the shop as no longer uninstalled (in case this app was uninstalled and reinstalled).
      uninstalledAt: undefined,

      // Mark the shop as active since it is being authenticated.
      active: true
    });
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
