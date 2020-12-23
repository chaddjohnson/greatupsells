const { Client: ElasticsearchClient } = require('@elastic/elasticsearch');
const models = require('../models');

const { ELASTICSEARCH_URL } = process.env;

const esClient = new ElasticsearchClient({
  node: ELASTICSEARCH_URL
});

const processRecord = async (record) => {
  const Log = await models.get('Log');

  // Parse the message.
  const { source, type, message, data } = JSON.parse(record.body);

  // Create log in MongoDB.
  const log = await Log.create({ source, type, message, data });

  // Index log data (minus data) in Elasticsearch.
  await esClient.index({
    index: 'logs',
    id: log.id,
    body: {
      type,
      message,
      date: log.createdAt.toISOString()
    }
  });

  // Force an index refresh; otherwise, we will not get any result in the consequent searches.
  await esClient.indices.refresh({ index: 'logs' });

  // TODO: Send email notification for error logs (via SNS? or SQS?).
};

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await Promise.all(event.Records.map(processRecord));
};

module.exports.handler = handler;
