const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const logger = require('@neatowebsolutions/upselling-logger');
const { Client: ElasticsearchClient } = require('@elastic/elasticsearch');
const models = require('../models');

const { ELASTICSEARCH_URL } = process.env;

const esClient = new ElasticsearchClient({
  node: ELASTICSEARCH_URL
});

const handler = async (event, context) => {
  if (event.source === 'serverless-plugin-warmup') {
    await new Promise((resolve) => setTimeout(resolve, 25));
    return 'Lambda is warm!';
  }

  context.callbackWaitsForEmptyEventLoop = false;

  try {
    const Log = await models.get('Log');
    const { query, type, page = 0, pageSize = 50 } =
      event.queryStringParameters || {};
    const conditions = [];

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

    // Pull in log data.
    const ids = hits.map(({ _id }) => _id);
    const logs = await Log.find({ _id: { $in: ids } }).lean();

    return {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(logs)
    };
  } catch (error) {
    await logger.error(`Error retrieving logs`, error, { event });

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
};

module.exports.handler = handler;
