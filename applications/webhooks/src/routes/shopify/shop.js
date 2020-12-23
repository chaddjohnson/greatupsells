const { StatusCodes } = require('http-status-codes');
const models = require('@neatowebsolutions/upselling-models');
const logger = require('@neatowebsolutions/upselling-logger');

const handler = async (request, response) => {
  const domain = request.headers['x-shopify-shop-domain'];
  const data = request.body;
  const Shop = await models.get('Shop');
  const shopifyShopId = data.id;
  const shop = await Shop.findByDomain(domain);

  // Respond immediately so that Shopify does not consider this webhook as timed out.
  response.status(StatusCodes.OK).end();

  if (shop) {
    try {
      shop.shopifyShopId = shopifyShopId;
      shop.name = data.name;
      shop.contactName = data.shop_owner;
      shop.contactEmail = data.email;
      shop.contactPhone = data.phone;
      shop.countryCode = data.country_code;
      shop.currency = data.currency;
      shop.locale = data.primary_locale;
      shop.timezone = data.iana_timezone;
      shop.shopifyPlan = data.plan_name;

      if (data.domain !== data.myshopify_domain) {
        shop.alternateDomain = data.domain;
      }

      await shop.save();

      // Deactivate the shop for our app if the Shopify shop plan is canceled.
      if (shop.shopifyPlan === 'cancelled') {
        await shop.deactivate();
        logger.info(`Shop closed (${shop.toString()})`);
      }

      logger.info(`Shop updated successfully (${shop.toString()})`, data);
    } catch (error) {
      logger.error(`Error updating shop (${shop.toString()})`, error, data);
    }
  } else {
    logger.warn(`Shop ${domain} not found for shop update webhook`, data);
  }
};

module.exports = handler;
