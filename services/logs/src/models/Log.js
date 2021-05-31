const mongoose = require('mongoose');
const { Client: ElasticsearchClient } = require('@elastic/elasticsearch');
const mongodbClient = require('./mongodbClient');

const { ELASTICSEARCH_URL } = process.env;

const esClient = new ElasticsearchClient({
  node: ELASTICSEARCH_URL
});

let Log = null;

const schema = new mongoose.Schema({
  source: { type: String, required: true, trim: true },
  type: {
    type: String,
    required: true,
    enum: ['INFO', 'WARN', 'ERROR']
  },
  message: { type: String, required: true, trim: true },
  stackTrace: { type: String, required: false, trim: true },
  data: { type: mongoose.Schema.Types.Mixed, required: false },
  createdAt: { type: Date, required: true, default: Date.now }
});

schema.pre('validate', function (next) {
  this.data = this.data.toString();
  next();
});

schema.post('save', async function (next) {
  const { id, type, message } = this;
  const date = this.createdAt.toISOString();

  // Index log data (minus data) in Elasticsearch. Note that Elasticsearch is
  // ONLY used as an index into the MongoDB "logs" collection and `data` is NOT
  // stored in Elasticsearch as Elasticsearch servers and storage are VERY
  // expensive.
  await esClient.index({
    index: 'logs',
    id,
    body: {
      type,
      message,
      date
    }
  });

  // Force an index refresh to ensure the logs are included in subsequent searches.
  await esClient.indices.refresh({ index: 'logs' });

  next();
});

Log = mongodbClient.connection.model('Log', schema);

module.exports = Log;
