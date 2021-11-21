const elasticsearch = require('@elastic/elasticsearch');

const { ELASTICSEARCH_URL } = process.env;

const esClient = new elasticsearch.Client({
  node: ELASTICSEARCH_URL,
  ssl: {
    rejectUnauthorized: false // allow self-signed certificate
  }
});

const postSave = async (log, next) => {
  const { id, source, type, message } = log;
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

  next();
};

module.exports.postSave = postSave;
