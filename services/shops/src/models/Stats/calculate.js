const Promise = require('bluebird');
const models = require('..');

const calculate = async (startDate, endDate) => {
  const Stats = await models.get('Stats');

  return await Promise.props({
    activeShopCount: Stats.calculateActiveShopCount(),
    grossProfitChange: Stats.calculateGrossProfitChange(startDate, endDate),
    monthlyGrossProfit: Stats.calculateMonthlyGrossProfit(),
    shopInstallCount: Stats.calculateShopInstallCount(startDate, endDate),
    shopUninstallCount: Stats.calculateShopUninstallCount(startDate, endDate)
  });
};

module.exports = calculate;
