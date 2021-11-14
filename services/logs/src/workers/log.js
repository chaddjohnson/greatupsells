const { Client: ElasticsearchClient } = require('@elastic/elasticsearch');
const models = require('../models');

const { ELASTICSEARCH_URL } = process.env;

const esClient = new ElasticsearchClient({
  node: ELASTICSEARCH_URL
});

const processRecord = async (record) => {
  const Log = await models.get('Log');

  // Parse the message.
  const { source, type, message, stackTrace, data } = JSON.parse(record.body);

  // Create log in MongoDB. Middleware will then create Elasticsearch document.
  const log = await Log.create({ source, type, message, stackTrace, data });
  const { id } = log;
  const createdAt = log.createdAt.toISOString();

  // Index log data (minus data) in Elasticsearch. Note that Elasticsearch is
  // ONLY used as an index into the MongoDB "logs" collection and `data` is NOT
  // stored in Elasticsearch.
  await esClient.index({
    index: 'logs',
    id,
    body: {
      source,
      type,
      message,
      createdAt
    }
  });

  // Force an index refresh to ensure the logs are included in subsequent searches.
  await esClient.indices.refresh({ index: 'logs' });

  // Enqueue an email notification for error logs.
  if (type === 'ERROR') {
    // TODO
  }
};

const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  await Promise.all(event.Records.map(processRecord));
};

module.exports.handler = handler;
