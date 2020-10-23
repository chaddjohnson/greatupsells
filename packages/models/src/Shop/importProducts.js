const AWS = require('aws-sdk');

const { SHOP_PRODUCT_IMPORT_QUEUE_URL } = process.env;

const importProducts = async (shop) => {
  const sqs = new AWS.SQS();

  // Enqueue a background worker.
  await sqs
    .sendMessage({
      QueueUrl: SHOP_PRODUCT_IMPORT_QUEUE_URL,
      MessageBody: JSON.stringify({
        shopId: shop.id
      })
    })
    .promise();
};

module.exports = importProducts;
