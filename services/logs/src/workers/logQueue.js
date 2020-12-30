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

  // TODO: Use Email Service to send email notification for error logs.
};

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await Promise.all(event.Records.map(processRecord));

  // Force an index refresh to ensure the logs are included subsequent searches.
  await esClient.indices.refresh({ index: 'logs' });
};

module.exports.handler = handler;
