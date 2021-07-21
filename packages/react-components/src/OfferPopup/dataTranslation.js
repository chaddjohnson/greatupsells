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
          price: formatCurrency(variant.price),
          salePrice: formatCurrency(
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
        }))
      };

      return translatedData;
    },
    [formatCurrency, offer]
  );

  return { translateProductData };
};

export default useDataTranslation;
