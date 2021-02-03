const Promise = require('bluebird');
const mongodbClient = require('../mongodbClient');

const calculate = async (startDate, endDate) => {
  const Stats = mongodbClient.connection.model('Stats');

  return await Promise.props({
    activeShopCount: Stats.calculateActiveShopCount(),
    grossProfitChange: Stats.calculateGrossProfitChange(startDate, endDate),
    monthlyGrossProfit: Stats.calculateMonthlyGrossProfit(),
    shopInstallCount: Stats.calculateShopInstallCount(startDate, endDate),
    shopUninstallCount: Stats.calculateShopUninstallCount(startDate, endDate)
  });
};

module.exports = calculate;
