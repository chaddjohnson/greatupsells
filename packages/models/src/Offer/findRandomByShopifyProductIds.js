// const buildCollectionsQuery = (shopifyProductIds) => {
//   const queries = shopifyProductIds.map(
//     (shopifyProductId) => /* GraphQL */ `
//       {
//         product${shopifyProductId}: product(id: "gid://shopify/Product/${shopifyProductId}") {
//           collections(first: 100, reverse: true) {
//             edges {
//               node {
//                 id
//               }
//             }
//           }
//         }
//       }
//     `
//   );

//   return `{${queries.join()}}`;
// };

// const findShopifyProductCollectionIds = async (shop, shopifyProductIds) => {
//   const shopifyApiClient = shop.getShopifyApiClient();
//   const query = buildCollectionsQuery(shopifyProductIds);

//   const products = (await shopifyApiClient.graphql(query)) || {};

//   // Extract collection IDs.
//   const shopifyCollectionIds = Object.values(products)
//     .map(({ collections }) =>
//       collections.edges.map(({ node }) => node.id.split('/').pop())
//     )
//     .flat();

//   return shopifyCollectionIds;
// };

const findRandomByShopifyProductIds = async (shop, shopifyProductIds) => {
  const models = require('..');
  const Offer = models.get('Offer');

  // Query Shopify for collections associated with each of the Shopify products.
  const shopifyCollectionIds = await findShopifyProductCollectionIds(
    shop,
    shopifyProductIds
  );

  // Flatten collection IDs across products.

  // Randomly find an offer having the Shopify product as a trigger OR a collection
  // to which the product belongs as a trigger.
  return Offer.find({
    'triggerProducts.shopifyProductId': { $in: shopifyProductIds },
    'triggerCollections.shopifyCollectionId': { $in: shopifyCollectionIds }
  });
};

module.exports = findRandomByShopifyProductIds;
