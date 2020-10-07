const { StatusCodes } = require('http-status-codes');
const models = require('@neatowebsolutions/upselling-models');
const logger = require('@neatowebsolutions/logger');

const handler = async (request, response) => {
  const domain = request.headers['x-shopify-shop-domain'];
  const data = request.body;
  const Shop = await models.get('Shop');
  const shop = await Shop.findByDomain(domain);

  // Respond immediately so that Shopify does not consider this webhook as timed out.
  response.status(StatusCodes.OK).end();

  if (shop) {
    try {
      // Use one round trip to prevent write conflicts.
      await Shop.findByIdAndUpdate(data.id, {
        shopifyShopId: data.id,
        name: data.name,
        contactName: data.shop_owner,
        contactEmail: data.email,
        contactPhone: data.phone,
        countryCode: data.country_code,
        currency: data.currency,
        locale: data.primary_locale,
        timezone: data.iana_timezone,
        shopifyPlan: data.plan_name,
        alternateDomain:
          data.domain !== data.myshopify_domain ? data.domain : undefined
      });

      // Deactivate the shop for our app if the shop plan is canceled.
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
