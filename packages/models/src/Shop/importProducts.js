const AWS = require('aws-sdk');

const { SHOP_PRODUCT_IMPORT_QUEUE_URL } = process.env;

const importProducts = async (shop) => {
  const sqs = new AWS.SQS();
  const shopProductCount = await shop.getProductCount();
  const { shopifyShopId } = shop;

  // Abort import if products have already been imported.
  if (shopProductCount > 1) {
    return;
  }

  // Enqueue a background worker.
  await sqs
    .sendMessage({
      QueueUrl: SHOP_PRODUCT_IMPORT_QUEUE_URL,
      MessageBody: JSON.stringify({
        shopifyShopId
      })
    })
    .promise();
};

module.exports = importProducts;
