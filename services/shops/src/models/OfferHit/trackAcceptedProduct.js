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
  const product = await Product.findOneByShopifyProductId(shopifyProductId);
  const shopifyProductData = product && { ...product.shopifyProductData };
  const { offer } = offerHit;
  let copiedProduct = null;
  let copiedVariant = null;
  const session = offerHit.$session();

  // Get a reference to the variant in the Shopify data.
  const variant =
    shopifyProductData &&
    shopifyProductData.variants.find(({ id }) => id === shopifyVariantId);

  const originalVariantPrice = parseFloat(variant.price);

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
  variant.price = offer.calculateDiscountedPrice(parseFloat(variant.price));

  try {
    // Copy the product (in Shopify and save locally) to allow modification of
    // the variant price. This seems to be the only feasible method of adjusting
    // the price of a cart item without using a discount code.
    copiedProduct = await product.copy(shopifyProductData, variant, quantity);
  } catch (error) {
    await logger.error(`Error copying product ${shopifyProductId}`, error, {
      variant: shopifyVariantId
    });
    throw error;
  }

  // Use the first variant as copying removes all variants except the target one.
  // eslint-disable-next-line prefer-destructuring
  copiedVariant = copiedProduct.shopifyProductData.variants[0];

  offerHit.originalProducts = offerHit.originalProducts || [];
  offerHit.acceptedProducts = offerHit.acceptedProducts || [];

  // Track the original product.
  offerHit.originalProducts.push({
    shopifyProductId,
    shopifyVariantId,
    price: originalVariantPrice
  });

  // Track the accepted product data for the offer hit.
  offerHit.acceptedProducts.push({
    shopifyProductId: copiedProduct.shopifyProductId,
    shopifyVariantId: copiedVariant.id,
    price: parseFloat(copiedVariant.price),
    quantity
  });

  offerHit.markModified('originalProducts');
  offerHit.markModified('acceptedProducts');

  await offerHit.save();
};

module.exports = trackAcceptedProduct;
