import { useCallback } from 'react';
import { useNumberFormatter } from '@neatowebsolutions/upselling-react-hooks';
import calculateDiscountedPrice from './calculateDiscountedPrice';

const getThumbnailImageUrl = (url) => {
  return url && url.replace(/\.(jpg|png)(\?|$)/i, '_400x.$1$2');
};

const useDataTranslation = (shop, offer) => {
  const { locale, countryCode, currency } = shop;
  const { formatCurrency } = useNumberFormatter({
    locale,
    countryCode,
    currency
  });

  const translateProductData = useCallback(
    (product = {}) => {
      const { shopifyProductData } = product;

      if (!shopifyProductData) {
        return;
      }

      const imagesById =
        shopifyProductData.images?.reduce(
          (map, image) => ({ ...map, [image.id]: image }),
          {}
        ) || {};

      const offeredProduct = offer.offeredProducts.find(
        (current) => current.shopifyProductId === product.shopifyProductId
      );

      const translatedData = {
        id: shopifyProductData.id,
        title: shopifyProductData.title,
        url: `/products/${shopifyProductData.handle}`,
        image: {
          src: getThumbnailImageUrl(shopifyProductData.image?.src),
          alt: shopifyProductData.image?.alt || shopifyProductData.title
        },
        variants: shopifyProductData.variants?.map((variant) => ({
          id: variant.id,
          title: variant.title,
          url: `/products/${shopifyProductData.handle}?variant=${variant.id}`,
          price: variant.price,
          salePrice: calculateDiscountedPrice(offer, parseFloat(variant.price)),
          priceFormatted: formatCurrency(variant.price),
          salePriceFormatted: formatCurrency(
            calculateDiscountedPrice(offer, parseFloat(variant.price))
          ),
          sku: variant.sku,
          image: {
            src: getThumbnailImageUrl(
              imagesById[variant.image_id]?.src || shopifyProductData.image?.src
            ),
            alt:
              imagesById[variant.image_id]?.alt ||
              shopifyProductData.image?.alt ||
              shopifyProductData.title
          },
          inventory: variant.inventory_quantity
        })),
        minQuantity: offeredProduct?.minQuantity || 1,
        maxQuantity: offeredProduct?.maxQuantity
      };

      return translatedData;
    },
    [formatCurrency, offer]
  );

  const translateTriggerProductData = useCallback(
    (product = {}, shopifyCartItems = []) => {
      const translatedData = translateProductData(product);

      // Find the cart item corresponding to the product.
      const shopifyCartItem = shopifyCartItems.find(
        (item) => item.product_id === translatedData.id
      );

      // Find the specific variant.
      const hasVariants = translatedData.variants.length > 1;
      const variant =
        hasVariants &&
        shopifyCartItem &&
        translatedData.variants.find(
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
