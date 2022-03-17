const models = require('..');

const trackAcceptedProducts = async (offerHit, shopifyDraftOrderId, items) => {
  const [Product] = await Promise.all([
    models.get('Product'),
    models.get('Offer')
  ]);

  await offerHit.execPopulate('offer');

  const acceptedProducts = await Promise.all(
    items.map(async ({ shopifyProductId, shopifyVariantId, quantity }) => {
      if (!shopifyProductId || !shopifyVariantId) {
        return;
      }

      const product = await Product.findOneByShopifyProductId(shopifyProductId);
      const { offer } = offerHit;

      // Get a reference to the variant in the Shopify data.
      const variant = product?.shopifyProductData?.variants.find(
        ({ id }) => id === shopifyVariantId
      );

      if (!product) {
        throw new Error(`Unable to find Shopify product ${shopifyProductId}`);
      }

      if (!variant) {
        throw new Error(
          `Unable to find Shopify product variant ${shopifyVariantId} for product (${product.toString()})`
        );
      }

      const originalPrice = parseFloat(variant.price);
      const acceptedPrice = offer.calculateDiscountedPrice(originalPrice);

      return {
        shopifyProductId,
        shopifyVariantId,
        originalPrice,
        acceptedPrice,
        quantity
      };
    })
  );

  // Track the draft order for the offer hit.
  offerHit.shopifyDraftOrderId = shopifyDraftOrderId;

  // Track the accepted product data for the offer hit.
  offerHit.acceptedProducts = offerHit.acceptedProducts || [];
  offerHit.acceptedProducts = offerHit.acceptedProducts.concat(
    acceptedProducts.filter(Boolean)
  );

  offerHit.acceptedAt = offerHit.acceptedAt || Date.now();

  offerHit.markModified('acceptedProducts');

  await offerHit.save();
};

module.exports = trackAcceptedProducts;
