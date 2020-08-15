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

  if (shopifyShopData.domain !== shopifyShopData.myshopify_domain) {
    shop.realDomain = shopifyShopData.domain;
  }

  await shop.save();

  logger.info(`Created new shop ${shopDomain}`);

  // Initialize the shop with Shopify.
  await shop.initialize();

  return shop;
};

const createOrUpdateShop = async (shopDomain, accessToken) => {
  const models = require('..');

  try {
    const Shop = await models.get('Shop');
    let shop = await Shop.findByDomain(shopDomain);

    if (!shop) {
      shop = await createShop(shopDomain, accessToken);
    }

    if (accessToken) {
      logger.info(
        `Updating access token to ${accessToken} for shop ${shopDomain}`
      );

      // Set the access token for the shop.
      shop.accessToken = accessToken;
    } else {
      logger.warn(
        `Attempted to update shop access token with empty token for shop ${shopDomain}`
      );
    }

    // Mark the shop as no longer uninstalled (in case this app was uninstalled and reinstalled).
    shop.uninstalledAt = undefined;

    // Mark the shop as active since it is being authenticated.
    shop.active = true;

    return shop.save();
  } catch (error) {
    logger.info(`Error creating new shop ${shopDomain}`, error);

    throw error;
  }
};

module.exports = createOrUpdateShop;
