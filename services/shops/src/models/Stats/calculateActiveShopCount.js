const mongodbClient = require('../mongodbClient');

const calculateActiveShopCount = async () => {
  const Shop = mongodbClient.connection.model('Shop');
  const criteria = {
    active: true
  };

  return await Shop.find(criteria).count();
};

module.exports = calculateActiveShopCount;
