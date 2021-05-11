// const { Client: ElasticsearchClient } = require('@elastic/elasticsearch');

// const { ELASTICSEARCH_URL } = process.env;

// const esClient = new ElasticsearchClient({
//   node: ELASTICSEARCH_URL
// });

// try {
//   const { body } = await client.search({
//     index: 'logs',
//     body: {
//       query: {
//         bool: {
//           must: [
//             {
//               query_string: {
//                 query: 'order',
//                 fields: ['message']
//               }
//             }
//             // { term: { type: 'INFO' } }
//           ]
//         }
//       }
//     }
//   });

//   console.log(body.hits.hits);
// } catch (error) {
//   //
// }
