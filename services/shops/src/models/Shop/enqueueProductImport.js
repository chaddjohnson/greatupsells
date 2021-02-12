const AWS = require('aws-sdk');

const { SHOP_PRODUCT_IMPORT_QUEUE_URL } = process.env;

const enqueueProductImport = async (shop) => {
  if (!SHOP_PRODUCT_IMPORT_QUEUE_URL) {
    return;
  }

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

module.exports = enqueueProductImport;
