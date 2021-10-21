const models = require('..');

const calculateActiveShopCount = async () => {
  const Shop = await models.get('Shop');
  const criteria = {
    active: true
  };

  return await Shop.find(criteria).count();
};

module.exports = calculateActiveShopCount;
