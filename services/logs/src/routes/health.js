const middy = require('@middy/core');
const cors = require('@middy/http-cors');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const elasticsearch = require('@elastic/elasticsearch');
const mongodbClient = require('../models/mongodbClient');

const { ELASTICSEARCH_URL } = process.env;

const esClient = new elasticsearch.Client({
  node: ELASTICSEARCH_URL,
  ssl: {
    rejectUnauthorized: false // allow self-signed certificate
  }
});

const handler = middy(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await Promise.all(mongodbClient.connect(), esClient.ping());

    if (!mongodbClient.connected) {
      throw new Error(`Cannot connect to MongoDB`);
    }

    return {
      statusCode: StatusCodes.OK,
      body: ReasonPhrases.OK
    };
  } catch (error) {
    console.error(error.stack); // eslint-disable-line no-console

    return {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
});

handler.use(cors());

module.exports.handler = handler;
