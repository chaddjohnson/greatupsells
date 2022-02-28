const vm = require('vm');
const https = require('https');
const { DateTime } = require('luxon');
const logger = require('@greatupsells/logger');
const models = require('..');

const convertToUSD = (amount, fromCurrency) => {
  return new Promise((resolve, reject) => {
    const request = https.get(
      'https://cdn.shopify.com/s/javascripts/currencies.js',
      (response) => {
        let code = '';

        response.on('data', (data) => {
          code += data.toString();
        });

        response.on('end', () => {
          const context = {};

          vm.createContext(context);
          vm.runInContext(code, context);

          if (!context.Currency?.convert) {
            throw new Error(
              'Shopify currency converter is unavailable, or implementation has changed'
            );
          }

          resolve(context.Currency.convert(amount, fromCurrency, 'USD'));
        });
      }
    );

    request.on('error', (error) => {
      reject(error);
    });
  });
};

const calculateMonthUpsellRevenue = async (shop) => {
  const OfferHit = await models.get('OfferHit');

  // Calculate month upsell revenue for the shop starting one month prior
  // to the next billing date.
  const periodStartDate = DateTime.fromISO(
    new Date(shop.plan.billingOn).toISOString()
  )
    .minus({ month: 1 })
    .toJSDate();

  const pipelines = [
    {
      $match: {
        revenueIncrease: { $gt: 0 },
        convertedAt: { $gte: periodStartDate }
      }
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: '$revenueIncrease'
        }
      }
    }
  ];

  let [{ total }] = await OfferHit.aggregate(pipelines);

  // Convert the total to USD if the shop currency is not USD.
  if (shop.currency !== 'USD') {
    try {
      total = await convertToUSD(total, shop.currency);
    } catch (error) {
      await logger.error('Unable to convert currency');
    }
  }

  return total;
};

module.exports = calculateMonthUpsellRevenue;
