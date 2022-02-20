import { useCallback } from 'react';
import { useCurrency } from '@greatupsells/react-hooks';
import calculateDiscountedPrice from './calculateDiscountedPrice';

const getThumbnailImageUrl = (url) => {
  return url && url.replace(/\.(jpg|png)(\?|$)/i, '_400x.$1$2');
};

const useDataTranslation = ({ shop, offer, locale, countryCode, currency }) => {
  const { currency: shopCurrency } = shop;
  const { formatCurrency, convertCurrency } = useCurrency({
    locale,
    countryCode,
    currency
  });

  const translateProductData = useCallback(
    (product = {}) => {
      if (!product) {
        return;
      }

      const { shopifyProductData } = product;

      if (!shopifyProductData) {
        return;
      }

      const imagesById =
        shopifyProductData.images?.reduce(
          (map, image) => ({ ...map, [image.id]: image }),
          {}
        ) || {};

      const translatedData = {
        id: shopifyProductData.id,
        title: shopifyProductData.title,
        url: `/products/${shopifyProductData.handle}`,
        image: {
          src: getThumbnailImageUrl(shopifyProductData.image?.src),
          alt: shopifyProductData.image?.alt || shopifyProductData.title
        },
        variants: shopifyProductData.variants?.map((variant) => {
          const price = convertCurrency(
            parseFloat(variant.price),
            shopCurrency,
            currency
          );
          const salePrice = convertCurrency(
            calculateDiscountedPrice(offer, variant.price),
            shopCurrency,
            currency
          );

          return {
            id: variant.id,
            title: variant.title,
            url: `/products/${shopifyProductData.handle}?variant=${variant.id}`,
            price,
            salePrice,
            priceFormatted: formatCurrency(price),
            salePriceFormatted: formatCurrency(salePrice),
            sku: variant.sku,
            image: {
              src: getThumbnailImageUrl(
                imagesById[variant.image_id]?.src ||
                  shopifyProductData.image?.src
              ),
              alt:
                imagesById[variant.image_id]?.alt ||
                shopifyProductData.image?.alt ||
                shopifyProductData.title
            },
            maxInventory:
              variant.inventory_policy !== 'continue' &&
              variant.inventory_management === 'shopify'
                ? Math.max(variant.inventory_quantity, 0) || 0
                : undefined,
            hasInventory:
              variant.inventory_management !== 'shopify' ||
              variant.inventory_quantity > 0 ||
              variant.inventory_policy === 'continue'
          };
        })
      };

      return translatedData;
    },
    [formatCurrency, offer]
  );

  const translateTriggerProductData = useCallback(
    (product = {}, shopifyCartItems = []) => {
      if (!product) {
        return;
      }

      const translatedData = translateProductData(product);

      // Find the cart item corresponding to the product.
      const shopifyCartItem = shopifyCartItems.find(
        (item) => item.product_id === translatedData.id
      );

      // Find the specific variant.
      const hasVariants = translatedData?.variants.length > 1;
      const variant =
        hasVariants &&
        shopifyCartItem &&
        translatedData?.variants.find(
          (current) => current.id === shopifyCartItem.variant_id
        );

      // Use specific variant data for display for a better customer experience.
      if (variant) {
        translatedData.title =
          shopifyCartItem.title ||
          `${product.title} - ${variant.title}` ||
          translatedData.title;
        translatedData.image.src =
          variant.image.src || translatedData.image.src;
        translatedData.image.alt =
          variant.image.alt || translatedData.image.alt;
      }

      return translatedData;
    },
    [translateProductData]
  );

  return { translateProductData, translateTriggerProductData };
};

export default useDataTranslation;
