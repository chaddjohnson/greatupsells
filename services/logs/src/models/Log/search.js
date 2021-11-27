const elasticsearch = require('@elastic/elasticsearch');
const models = require('..');

const { ELASTICSEARCH_URL } = process.env;

const esClient = new elasticsearch.Client({
  node: ELASTICSEARCH_URL,
  ssl: {
    rejectUnauthorized: false // allow self-signed certificate
  }
});

const search = async (type, query, page = 0, pageSize = 50) => {
  const Log = await models.get('Log');
  const conditions = [];

  // Limit page size.
  pageSize = Math.min(pageSize, 500);

  // Filter by query.
  if (query) {
    conditions.push({
      query_string: {
        query,
        fields: ['message']
      }
    });
  }

  // Filter by type.
  if (type) {
    conditions.push({ term: { type } });
  }

  // Query the index.
  const { body } = await esClient.search({
    index: 'logs',
    body: {
      from: page * pageSize,
      size: pageSize,
      query: {
        bool: {
          must: conditions
        }
      }
    }
  });

  // Filter out empty results.
  const hits = body.hits.hits.filter((hit) => !!hit);

  // Aggregate search results with log data.
  const ids = hits.map(({ _id }) => _id);
  const logs = await Log.find({ _id: { $in: ids } }).lean();

  return logs;
};

module.exports = search;
