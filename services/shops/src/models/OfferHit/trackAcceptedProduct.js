const logger = require('@neatowebsolutions/upselling-logger');
const mongodbClient = require('../mongodbClient');

const trackAcceptedProduct = async (
  offerHit,
  shopifyProductId,
  shopifyVariantId,
  quantity
) => {
  await offerHit.execPopulate('offer');

  const Product = mongodbClient.connection.model('Product');
  const product = await Product.findByShopifyProductId(shopifyProductId);
  const shopifyProductData = product && { ...product.shopifyProductData };
  const { offer } = offerHit;
  let copiedProduct = null;
  let copiedShopifyProductData = null;
  let copiedVariant = null;
  const session = offerHit.$session();

  // Get a reference to the variant in the Shopify data.
  const variant =
    shopifyProductData &&
    shopifyProductData.variants.find(({ id }) => id === shopifyVariantId);

  // Keep track of the variant position.
  const variantIndex =
    shopifyProductData &&
    shopifyProductData.variants.findIndex(({ id }) => id === shopifyVariantId);

  if (!product) {
    throw new Error(`Unable to find Shopify product ${shopifyProductId}`);
  }

  if (!variant) {
    throw new Error(
      `Unable to find Shopify product variant ${shopifyVariantId} for product (${product.toString()})`
    );
  }

  product.$session(session);

  // Calculate the price discount for the variant based on the offer. Set this
  // value prior to copying the product so it is reflected in the copy.
  variant.price = offer.calculateDiscountedPrice(variant.price);

  // Use the original variant price for the Compare At price. Set this value
  // prior to copying the product so it is reflected in the copy.
  variant.compare_at_price = variant.price;

  try {
    // Copy the product (in Shopify and saving locally) to allow modification of
    // the variant price. This seems to be the only feasible method of adjusting
    // the price of a cart item without using a discount code.
    copiedProduct = await product.copy(shopifyProductData);
  } catch (error) {
    logger.error(
      `Error copying product ${shopifyProductId}`,
      error,
      `Variant = ${shopifyVariantId}`
    );
    throw error;
  }

  copiedShopifyProductData = copiedProduct.shopifyProductData;
  copiedVariant = copiedShopifyProductData.variants[variantIndex];

  // Track the accepted product data for the offer hit.
  offerHit.acceptedShopifyProductId = copiedProduct.shopifyProductId;
  offerHit.acceptedShopifyVariantId = copiedVariant.id;
  offerHit.acceptedShopifyVariantPrice = copiedVariant.price;
  offerHit.acceptedShopifyProductQuantity = quantity;

  await offerHit.save();
};

module.exports = trackAcceptedProduct;
