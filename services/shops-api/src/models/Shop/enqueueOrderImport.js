const AWS = require('aws-sdk');

const { SHOP_ORDER_IMPORT_QUEUE_URL } = process.env;

const enqueueOrderImport = async (shop) => {
  if (!SHOP_ORDER_IMPORT_QUEUE_URL) {
    return;
  }

  const sqs = new AWS.SQS();

  // Enqueue a background worker.
  await sqs
    .sendMessage({
      QueueUrl: SHOP_ORDER_IMPORT_QUEUE_URL,
      MessageBody: JSON.stringify({
        shopId: shop.id
      })
    })
    .promise();
};

module.exports = enqueueOrderImport;
