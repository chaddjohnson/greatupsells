const models = require('..');

const calculateShopInstallCount = async (startDate, endDate) => {
  const Shop = await models.get('Shop');
  const criteria = {
    active: true,
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  };

  return await Shop.find(criteria).count();
};

module.exports = calculateShopInstallCount;
