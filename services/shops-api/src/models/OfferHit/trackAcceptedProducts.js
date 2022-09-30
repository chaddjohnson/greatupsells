const models = require('..');

const trackAcceptedProducts = async (
  offerHit,
  items,
  { shopifyDraftOrderId, shopifyOrderId }
) => {
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

      const { offer, triggerProduct } = offerHit;
      const {
        shopifyProductId: triggerShopifyProductId,
        shopifyVariantId: triggerShopifyVariantId
      } = triggerProduct;
      const { strategy } = offer;
      const originalShopifyProductId =
        strategy === 'UPSELL' ? triggerShopifyProductId : shopifyProductId;
      const originalShopifyVariantId =
        strategy === 'UPSELL' ? triggerShopifyVariantId : shopifyVariantId;
      const originalProduct = await Product.findOneByShopifyProductId(
        originalShopifyProductId
      );
      const acceptedProduct = await Product.findOneByShopifyProductId(
        shopifyProductId
      );

      // Get a reference to the variant in the Shopify data.
      const originalVariant = originalProduct?.shopifyProductData?.variants.find(
        ({ id }) => id === originalShopifyVariantId
      );
      const acceptedVariant = acceptedProduct?.shopifyProductData?.variants.find(
        ({ id }) => id === shopifyVariantId
      );

      if (!originalProduct) {
        throw new Error(
          `Unable to find Shopify product ${originalShopifyProductId}`
        );
      }
      if (!acceptedProduct) {
        throw new Error(`Unable to find Shopify product ${shopifyProductId}`);
      }
      if (!originalVariant) {
        throw new Error(
          `Unable to find Shopify product variant ${originalShopifyVariantId} for product (${originalProduct.toString()})`
        );
      }
      if (!acceptedVariant) {
        throw new Error(
          `Unable to find Shopify product variant ${shopifyVariantId} for product (${acceptedProduct.toString()})`
        );
      }

      const originalPrice = parseFloat(originalVariant.price);
      const acceptedProductPrice = parseFloat(acceptedVariant.price);
      const acceptedPrice = offer.calculateDiscountedPrice(
        acceptedProductPrice
      );

      return {
        shopifyProductId,
        shopifyVariantId,
        originalPrice,
        acceptedPrice,
        quantity
      };
    })
  );

  // Track the draft order for the offer hit (if available).
  offerHit.shopifyDraftOrderId = shopifyDraftOrderId;

  // Track the  order for the offer hit (if available).
  offerHit.shopifyOrderId = shopifyOrderId;

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
