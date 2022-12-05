const crypto = require('crypto');

const preValidate = (shop, next) => {
  const { shopifyShopData } = shop;

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

  // Remove extraneous characters from the contact phone number.
  if (shop.contactPhone) {
    shop.contactPhone = shop.contactPhone.toString().replace(/[^\d\+]/g, '');
  }

  // Generate a testing token.
  if (!shop.testToken) {
    shop.testToken = crypto
      .createHash('md5')
      .update((Math.random() * 1000000).toString())
      .digest('hex');
  }

  next();
};

module.exports.preValidate = preValidate;
