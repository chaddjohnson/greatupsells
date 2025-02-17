const Promise = require('bluebird');
const { shuffle } = require('lodash');
const models = require('..');

const findPairedProducts = async (
  shop,
  shopifyProductIds,
  quantity,
  excludedShopifyProductIds = []
) => {
  shopifyProductIds = shopifyProductIds || [];

  const [PairedPurchase, Product] = await Promise.all([
    models.get('PairedPurchase'),
    models.get('Product')
  ]);

  // Randomize items in the cart in case there are more items in the cart than
  // the number of products that should be presented in the offered.
  const shuffledShopifyProductIds = shuffle(shopifyProductIds).slice(
    0,
    quantity
  );

  // Track products already found to prevent duplicates. Also exclude products
  // already added to the cart.
  excludedShopifyProductIds =
    excludedShopifyProductIds.concat(shopifyProductIds);

  // Try to find paired products.
  const pairedProducts = (
    await Promise.mapSeries(
      shuffledShopifyProductIds,
      async (shopifyProductId) => {
        const product = await PairedPurchase.findOnePairedProduct(
          shopifyProductId,
          { excludedShopifyProductIds }
        );

        if (product) {
          excludedShopifyProductIds.push(product.shopifyProductId);
        }

        return product;
      }
    )
  ).filter(Boolean);

  // Determine how many more products are needed.
  let remainingQuantity = quantity - pairedProducts.length;

  // Return paired products if enough were found.
  if (remainingQuantity <= 0) {
    return pairedProducts;
  }

  // Select top sold products for remaiming products.
  const topProducts = (
    await Promise.mapSeries([...Array(remainingQuantity).keys()], async () => {
      const product = await PairedPurchase.findOneTopProduct(shop, {
        excludedShopifyProductIds
      });

      if (product) {
        excludedShopifyProductIds.push(product.shopifyProductId);
      }

      return product;
    })
  ).filter(Boolean);

  // Determine how many more products are needed.
  remainingQuantity = quantity - (pairedProducts.length + topProducts.length);

  if (remainingQuantity <= 0) {
    return [...pairedProducts, ...topProducts];
  }

  // Select random products if no top products are found.
  const randomProducts = (
    await Promise.mapSeries([...Array(remainingQuantity).keys()], async () => {
      const product = await Product.findOneRandomByShop(shop);

      if (product) {
        excludedShopifyProductIds.push(product.shopifyProductId);
      }

      return product;
    })
  ).filter(Boolean);

  return [...pairedProducts, ...topProducts, ...randomProducts];
};

module.exports = findPairedProducts;
