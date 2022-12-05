const useShopifyCart = (shopifyCartItems) => {
  const findTriggerProductShopifyVariantId = (triggerProduct) => {
    if (!triggerProduct) {
      return;
    }

    const { shopifyProductId, shopifyProductData } = triggerProduct;
    const { variants } = shopifyProductData;

    // Find the cart item corresponding to the product.
    const shopifyCartItem = shopifyCartItems.find(
      (item) => item.product_id === shopifyProductId
    );

    // Find the specific variant.
    const hasVariants = variants.length > 1;
    const variant =
      hasVariants &&
      shopifyCartItem &&
      variants.find((current) => current.id === shopifyCartItem.variant_id);

    return variant?.id;
  };

  return { findTriggerProductShopifyVariantId };
};

export default useShopifyCart;
