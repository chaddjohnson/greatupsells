const logger = require('@neatowebsolutions/logger');

const trackAcceptedProduct = async (
  offerHit,
  productId,
  variantId,
  quantity
) => {
  const models = require('..');
  const Product = await models.get('Product');
  const product = await Product.findByShopifyProductId(productId);
  const Offer = await models.get('Offer');
  const offer = await Offer.findById(offerHit.offer);
  const shopifyProductData = product && { ...product.shopifyProductData };
  let copiedProduct = null;
  let copiedShopifyProductData = null;

  // Get a reference to the variant in the Shopify data.
  const variant =
    shopifyProductData &&
    shopifyProductData.variants.find(({ id }) => id === variantId);

  // Keep track of the variant position.
  const variantIndex =
    shopifyProductData &&
    shopifyProductData.variants.findIndex(({ id }) => id === variantId);

  if (!product) {
    throw new Error(`Unable to find Shopify product ${productId}`);
  }

  if (!variant) {
    throw new Error(
      `Unable to find Shopify product variant ${variantId} for product (${product.toString()})`
    );
  }

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
      `Error copying product ${productId}`,
      error,
      `Variant = ${variantId}`
    );
    throw error;
  }

  copiedShopifyProductData = copiedProduct.shopifyProductData;

  // Track the accepted product data for the offer hit.
  offerHit.acceptedShopifyProductId = copiedProduct.shopifyProductId;
  offerHit.acceptedShopifyProductVariantId =
    copiedShopifyProductData.variants[variantIndex].id;
  offerHit.acceptedShopifyProductVariantPrice =
    copiedShopifyProductData.variants[variantIndex].price;
  offerHit.acceptedShopifyProductQuantity = quantity;
};

module.exports = trackAcceptedProduct;
