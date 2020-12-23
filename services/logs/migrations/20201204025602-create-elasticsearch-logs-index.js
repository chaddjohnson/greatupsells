const { Client: ElasticsearchClient } = require('@elastic/elasticsearch');

const { ELASTICSEARCH_URL } = process.env;

const esClient = new ElasticsearchClient({
  node: ELASTICSEARCH_URL
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
        mappings: {
          properties: {
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
