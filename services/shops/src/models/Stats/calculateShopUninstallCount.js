const models = require('..');

const calculateShopUninstallCount = async (startDate, endDate) => {
  const Shop = await models.get('Shop');
  const criteria = {
    active: true,
    uninstalledAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  };

  return await Shop.find(criteria).count();
};

module.exports = calculateShopUninstallCount;
