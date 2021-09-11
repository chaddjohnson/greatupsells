const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { Client: ElasticsearchClient } = require('@elastic/elasticsearch');
const mongodbClient = require('../models/mongodbClient');

const { ELASTICSEARCH_URL } = process.env;

const esClient = new ElasticsearchClient({
  node: ELASTICSEARCH_URL
});

const handler = middy(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await mongodbClient.connect();
    await esClient.ping();

    if (!mongodbClient.connected) {
      throw new Error(`Cannot connect to MongoDB`);
    }

    return {
      statusCode: StatusCodes.OK,
      body: ReasonPhrases.OK
    };
  } catch (error) {
    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
});

handler.use(cors());

module.exports.handler = handler;
