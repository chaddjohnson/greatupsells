const AWS = require('aws-sdk');

const { SHOP_COLLECTION_IMPORT_QUEUE_URL } = process.env;

const enqueueCollectionImport = async (shop) => {
  if (!SHOP_COLLECTION_IMPORT_QUEUE_URL) {
    return;
  }

  const sqs = new AWS.SQS();

  // Enqueue a background worker.
  await sqs
    .sendMessage({
      QueueUrl: SHOP_COLLECTION_IMPORT_QUEUE_URL,
      MessageBody: JSON.stringify({
        shopId: shop.id
      })
    })
    .promise();
};

module.exports = enqueueCollectionImport;
