const AWS = require('aws-sdk');

const { SHOP_COLLECTION_IMPORT_QUEUE_URL } = process.env;

const importCollections = async (shop) => {
  const sqs = new AWS.SQS();
  const shopCollectionCount = await shop.getCollectionCount();
  const { shopifyShopId } = shop;

  // Abort import if collections have already been imported.
  if (shopCollectionCount > 1) {
    return;
  }

  // Enqueue a background worker.
  await sqs
    .sendMessage({
      QueueUrl: SHOP_COLLECTION_IMPORT_QUEUE_URL,
      MessageBody: JSON.stringify({
        shopifyShopId
      })
    })
    .promise();
};

module.exports = importCollections;
