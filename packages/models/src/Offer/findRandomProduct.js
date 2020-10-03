const {
  transformShopifyProduct
} = require('@neatowebsolutions/shopify-graphql-transform');
const models = require('..');

const findRandomCollectionProductId = async (shop, shopifyCollectionId) => {
  const shopifyApiClient = shop.getShopifyApiClient();

  // TODO: Look in first 100.
  const query = /* GraphQL */ `
    #
  `;

  const result = await shopifyApiClient.graphql(query);

  //
};

const findShopifyProduct = async (shop, shopifyProductId) => {
  const shopifyApiClient = shop.getShopifyApiClient();
  const query = /* GraphQL */ `
    {
      product(id: "gid://shopify/Product/${shopifyProductId}") {
        id
        title
        handle
        images(first: 1) {
          edges {
            node {
              id
              altText
              originalSrc
            }
          }
        }
      }
    }
  `;

  const result = await shopifyApiClient.graphql(query);

  return transformShopifyProduct(result.product);
};

// TODO: Ensure the product actually still exists.

const getRandomItem = (array = []) =>
  array[Math.floor(Math.random() * array.length)];

const findRandomProduct = async function (offer) {
  const Shop = await models.get('Shop');
  const shop = await Shop.findById(offer.shop);
  const { products, collections } = offer;

  // TODO ?
  const productOrCollection = Math.round(Math.random());

  const selectProduct =
    productOrCollection === 0 || !collections || collections.length === 0;
  const selectCollection =
    productOrCollection === 1 || !products || products.length === 0;

  const noTriggers =
    (!products || products.length === 0) &&
    (!collections || collections.length === 0);

  let shopifyProductId;
  let shopifyCollectionId;

  // Return nothing if the offer has no triggers.
  if (noTriggers) {
    return;
  }

  if (selectProduct) {
    // Select a random product.
    shopifyProductId = getRandomItem(products).shopifyProductId;
  } else if (selectCollection) {
    // Select a random collection.
    shopifyCollectionId = getRandomItem(collections).shopifyCollectionId;

    // Select a random product from the collection.
    shopifyProductId = await findRandomCollectionProductId(
      shop,
      shopifyCollectionId
    );
  }

  // Look up product details with Shopify.
  return findShopifyProduct(shopifyProductId);
};

module.exports = findRandomProduct;
