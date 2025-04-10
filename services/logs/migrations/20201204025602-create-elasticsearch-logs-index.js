const elasticsearch = require('@elastic/elasticsearch');

const { ELASTICSEARCH_URL } = process.env;

const esClient = new elasticsearch.Client({
  node: ELASTICSEARCH_URL,
  ssl: {
    rejectUnauthorized: false // allow self-signed certificate
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
          number_of_replicas: 1
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
