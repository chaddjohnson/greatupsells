const elasticsearch = require('@elastic/elasticsearch');

const { NODE_ENV, ELASTICSEARCH_URL } = process.env;
const dev = NODE_ENV !== 'production';

const esClient = new elasticsearch.Client({
  node: ELASTICSEARCH_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = {
  async up() {
    try {
      await esClient.indices.delete({ index: 'logs' });
    } catch (error) {
      // Index does not exist; ignore.
    }

    await esClient.indices.create({
      index: 'logs',
      body: {
        settings: {
          number_of_replicas: dev ? 1 : 2
        },
        mappings: {
          properties: {
            source: {
              type: 'text'
            },
            type: {
              type: 'text'
            },
            message: {
              type: 'text'
            },
            createdAt: {
              type: 'date'
            }
          }
        }
      }
    });
  },

  async down() {
    await esClient.indices.delete({ index: 'logs' });
  }
};
