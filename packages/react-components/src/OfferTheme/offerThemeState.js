import { useState, useMemo, useEffect } from 'react';
import {
  useCookies,
  useCurrency,
  usePushStateListener
} from '@greatupsells/react-hooks';
import useDataTranslation from './dataTranslation';

const useOfferThemeState = ({
  shop,
  offer,
  locale = 'en',
  countryCode = 'US',
  currency = 'USD',
  triggerProduct,
  offeredProducts,
  shopifyCartItems,
  shopifyCartTotal,
  shopifyCartItemCount = 0,
  onAddProducts,
  onReplaceProduct,
  handlers
}) => {
  const [addingProduct, setAddingProduct] = useState(
    Array(offeredProducts.length).fill(false)
  );
  const [addingProductBundle, setAddingProductBundle] = useState(false);
  const [productBundleAdded, setProductBundleAdded] = useState(false);

  const { getCookie } = useCookies();
  const {
    strategy,
    enableBundling,
    performActionOnAdd,
    enableVariantSelection,
    enableQuantitySelection
  } = offer;
  const { currency: shopCurrency } = shop;
  const { formatCurrency, convertCurrency } = useCurrency({
    locale,
    countryCode,
    currency
  });

  const [checkoutUrl, setCheckoutUrl] = useState(
    getCookie('greatupsellsDraftOrderInvoiceUrl') ||
      (typeof window !== 'undefined' && window.Shopify?.routes?.root
        ? `${window.Shopify?.routes?.root}checkout`
        : '/checkout')
  );
  const [addedQuantities, setAddedQuantities] = useState(
    [...Array(offeredProducts.length).keys()].map(() => 0)
  );

  const { translateProductData, translateTriggerProductData } =
    useDataTranslation({ shop, offer, locale, countryCode, currency });

  const translatedTriggerProduct = useMemo(() => {
    if (triggerProduct) {
      return translateTriggerProductData(triggerProduct, shopifyCartItems);
    }
  }, [offer, triggerProduct]); // eslint-disable-line react-hooks/exhaustive-deps

  const translatedOfferedProducts = useMemo(() => {
    if (offeredProducts) {
      return offeredProducts.map(translateProductData);
    }
  }, [offer, offeredProducts]); // eslint-disable-line react-hooks/exhaustive-deps

  const [selectedVariants, setSelectedVariants] = useState(
    translatedOfferedProducts.map(({ variants }) => {
      const firstVariantHavingInventory = variants.find(
        (current) => current.hasInventory
      );
      const firstVariant = variants[0];

      return firstVariantHavingInventory || firstVariant;
    })
  );
  const [selectedQuantities, setSelectedQuantities] = useState(
    translatedOfferedProducts.map(() => 1)
  );

  const actionButtonUrl = useMemo(() => {
    if (offer.actionButtonBehavior === 'CHECKOUT') {
      return checkoutUrl;
    } else if (offer.actionButtonBehavior === 'CART') {
      return typeof window !== 'undefined' && window.Shopify?.routes.root
        ? `${window.Shopify?.routes.root}cart`
        : '/cart';
    } else if (offer.actionButtonBehavior === 'PAGE') {
      return handlers.handleClose;
    } else if (offer.actionButtonBehavior === 'LINK') {
      return offer.actionButtonLink;
    }

    return checkoutUrl;
  }, [offer, checkoutUrl, handlers]);

  const actionButtonTarget = useMemo(() => {
    const openInNewTab =
      offer.actionButtonBehavior === 'LINK' &&
      offer.actionButtonLinkOpenInNewTab;

    if (openInNewTab) {
      return '_blank';
    }

    return '_top';
  }, [offer.actionButtonBehavior, offer.actionButtonLinkOpenInNewTab]);

  const addedQuantity = useMemo(
    () =>
      Object.values(addedQuantities).reduce((sum, quantity) => {
        return sum + quantity;
      }, 0),
    [addedQuantities]
  );

  const maxQuantities = useMemo(() => {
    const { maximumAcceptedProductQuantity } = offer;
    const hasMaxQuantity = typeof maximumAcceptedProductQuantity === 'number';
    const remainingQuantity =
      hasMaxQuantity && maximumAcceptedProductQuantity - addedQuantity;

    return translatedOfferedProducts.map((offeredProduct, index) => {
      const maxInventory = selectedVariants[index]?.maxInventory;
      const hasMaxInventory = typeof maxInventory === 'number';
      const addedVariantQuantity = addedQuantities[index] || 0;
      const remainingInventory =
        hasMaxInventory && maxInventory - addedVariantQuantity;

      if (hasMaxQuantity && hasMaxInventory) {
        return Math.min(remainingQuantity, remainingInventory);
      }
      if (hasMaxQuantity) {
        return remainingQuantity;
      }
      if (hasMaxInventory) {
        return remainingInventory;
      }

      return 1;
    });
  }, [
    addedQuantities,
    addedQuantity,
    offer,
    translatedOfferedProducts,
    selectedVariants
  ]);

  const addingProductEnabled = useMemo(() => {
    const { maximumAcceptedProductQuantity } = offer;
    const hasMaxQuantity = typeof maximumAcceptedProductQuantity === 'number';
    const remainingQuantity =
      hasMaxQuantity && maximumAcceptedProductQuantity - addedQuantity;

    return translatedOfferedProducts.map((offeredProduct, index) => {
      const selectedQuantity = parseInt(selectedQuantities[index]);
      const selectedQuantityValid =
        typeof selectedQuantity === 'number' &&
        !Number.isNaN(selectedQuantity) &&
        selectedQuantity > 0 &&
        selectedQuantity % 1 === 0;
      const selectedQuantityAtOrBelowRemaining =
        !hasMaxQuantity ||
        (selectedQuantityValid && selectedQuantity <= remainingQuantity);
      const addedQuantityBelowMax =
        !hasMaxQuantity || addedQuantity < maximumAcceptedProductQuantity;
      const selectedVariantHasInventory = selectedVariants[index]?.hasInventory;
      const atOrBelowMaxInventory = selectedQuantity <= maxQuantities[index];

      return (
        addedQuantityBelowMax &&
        selectedQuantityAtOrBelowRemaining &&
        selectedQuantityValid &&
        selectedVariantHasInventory &&
        !addingProduct[index] &&
        atOrBelowMaxInventory
      );
    });
  }, [
    addedQuantity,
    addingProduct,
    offer,
    translatedOfferedProducts,
    selectedQuantities,
    selectedVariants,
    maxQuantities
  ]);

  const replacingProductEnabled = useMemo(
    () =>
      translatedOfferedProducts.map((offeredProduct, index) => {
        const selectedVariantHasInventory =
          selectedVariants[index]?.hasInventory;

        return selectedVariantHasInventory && !addingProduct[index];
      }),
    [addingProduct, translatedOfferedProducts, selectedVariants]
  );

  const addProductBundleEnabled = useMemo(
    () =>
      selectedQuantities.every((selectedQuantity, index) => {
        const { maximumAcceptedProductQuantity } = offer;
        const hasMaxQuantity =
          typeof maximumAcceptedProductQuantity === 'number';
        const selectedQuantityValue = parseInt(selectedQuantities[index]);
        const selectedQuantityValid =
          typeof selectedQuantityValue === 'number' &&
          !Number.isNaN(selectedQuantity) &&
          selectedQuantityValue > 0 &&
          selectedQuantityValue % 1 === 0;
        const selectedQuantityAtOrBelowMax =
          !hasMaxQuantity ||
          (selectedQuantityValid &&
            selectedQuantityValue <= maximumAcceptedProductQuantity);

        return (
          selectedQuantityValid &&
          selectedQuantityAtOrBelowMax &&
          !addingProductBundle
        );
      }),
    [addingProductBundle, offer, selectedQuantities]
  );

  const handleVariantChange = (productIndex, variantId) => {
    const updatedSelectedVariants = [...selectedVariants];
    const { variants } = translatedOfferedProducts[productIndex];

    updatedSelectedVariants[productIndex] = variants.find(
      ({ id }) => id === parseInt(variantId)
    );

    setSelectedVariants(updatedSelectedVariants);
  };

  const handleQuantityChange = (productIndex, quantity) => {
    const updatedSelectedQuantities = [...selectedQuantities];

    updatedSelectedQuantities[productIndex] = quantity;
    setSelectedQuantities(updatedSelectedQuantities);
  };

  const shopifyCartTotalFormatted = useMemo(
    () =>
      formatCurrency(
        convertCurrency(shopifyCartTotal || 0, shopCurrency, currency)
      ),
    [convertCurrency, currency, formatCurrency, shopCurrency, shopifyCartTotal]
  );

  const subtotalFormatted = useMemo(() => {
    const subtotal = selectedVariants.reduce((sum, { salePrice }, index) => {
      const quantity = parseInt(selectedQuantities[index]);

      return sum + salePrice * quantity;
    }, 0);

    return formatCurrency(convertCurrency(subtotal, shopCurrency, currency));
  }, [
    convertCurrency,
    currency,
    formatCurrency,
    selectedQuantities,
    selectedVariants,
    shopCurrency
  ]);

  const savingsFormatted = useMemo(() => {
    const savings = selectedVariants.reduce(
      (sum, { price, salePrice }, index) => {
        const quantity = parseInt(selectedQuantities[index]);

        return sum + (price - salePrice) * quantity;
      },
      0
    );

    return formatCurrency(convertCurrency(savings, shopCurrency, currency));
  }, [
    convertCurrency,
    currency,
    formatCurrency,
    selectedQuantities,
    selectedVariants,
    shopCurrency
  ]);

  const handleQuantityAdd = (index, quantity) =>
    setAddedQuantities(
      addedQuantities.map((currentAddedQuantity, currentAddedQuantityIndex) => {
        return currentAddedQuantityIndex === index
          ? currentAddedQuantity + quantity
          : currentAddedQuantity;
      })
    );

  const handleAddProduct = async (productIndex) => {
    const offerId = offer._id;
    const shopifyProductId = translatedOfferedProducts[productIndex].id;
    const shopifyVariantId = selectedVariants[productIndex].id;
    const quantity = parseInt(selectedQuantities[productIndex]);
    const updatedAddingProduct = [...addingProduct];
    const singleOfferedProduct = offeredProducts.length === 1;

    // Flag that the product is being added.
    updatedAddingProduct[productIndex] = true;
    setAddingProduct([...updatedAddingProduct]);

    try {
      await onAddProducts(offerId, [
        { offerId, shopifyProductId, shopifyVariantId, quantity }
      ]);
      handleQuantityAdd(productIndex, quantity);
      setCheckoutUrl(getCookie('greatupsellsDraftOrderInvoiceUrl'));

      // Impose a delay to allow the checkout URL update to propagate.
      await new Promise((resolve) => setTimeout(resolve, 125));

      if (!singleOfferedProduct) {
        // Unflag that the product is being added.
        updatedAddingProduct[productIndex] = false;
        setAddingProduct([...updatedAddingProduct]);
      }
    } catch (error) {
      // Unflag that the product is being added.
      updatedAddingProduct[productIndex] = false;
      setAddingProduct([...updatedAddingProduct]);

      throw error;
    }
  };

  const handleAddProductBundle = async () => {
    const offerId = offer._id;
    const productCount = translatedOfferedProducts.length;
    const items = [...Array(productCount).keys()].map((productIndex) => ({
      offerId,
      shopifyProductId: translatedOfferedProducts[productIndex].id,
      shopifyVariantId: selectedVariants[productIndex].id,
      quantity: parseInt(selectedQuantities[productIndex])
    }));

    setAddingProductBundle(true);

    try {
      await onAddProducts(offerId, items);

      [...Array(productCount).keys()].forEach((productIndex) => {
        if (items[productIndex].quantity > 0) {
          handleQuantityAdd(productIndex, items[productIndex].quantity);
        }
      });

      setCheckoutUrl(getCookie('greatupsellsDraftOrderInvoiceUrl'));

      // Impose a delay to allow the checkout URL update to propagate.
      await new Promise((resolve) => setTimeout(resolve, 25));

      setProductBundleAdded(true);
    } catch (error) {
      setAddingProductBundle(false);

      throw error;
    }
  };

  const handleReplaceProduct = async (
    triggerShopifyProductId,
    productIndex
  ) => {
    const offerId = offer._id;
    const shopifyProductId = translatedOfferedProducts[productIndex].id;
    const shopifyVariantId = selectedVariants[productIndex].id;
    const updatedAddingProduct = [...addingProduct];
    const singleOfferedProduct = offeredProducts.length === 1;

    // Flag that the product is being added.
    updatedAddingProduct[productIndex] = true;
    setAddingProduct([...updatedAddingProduct]);

    try {
      await onReplaceProduct(
        offerId,
        triggerShopifyProductId,
        shopifyProductId,
        shopifyVariantId
      );
      handleQuantityAdd(productIndex, 1);
      setCheckoutUrl(getCookie('greatupsellsDraftOrderInvoiceUrl'));

      // Impose a delay to allow the checkout URL update to propagate.
      await new Promise((resolve) => setTimeout(resolve, 25));

      if (!singleOfferedProduct) {
        // Unflag that the product is being added.
        updatedAddingProduct[productIndex] = false;
        setAddingProduct([...updatedAddingProduct]);
      }
    } catch (error) {
      // Unflag that the product is being added.
      updatedAddingProduct[productIndex] = false;
      setAddingProduct([...updatedAddingProduct]);

      throw error;
    }
  };

  const handleThankYouPageAddProduct = async (productIndex) => {
    const updatedAddingProduct = [...addingProduct];

    await handleAddProduct(productIndex);

    // Flag that the product is being added.
    updatedAddingProduct[productIndex] = true;
    setAddingProduct([...updatedAddingProduct]);

    // This timeout serves as a workaround. For some strange reason, with
    // Thank You Page offers (and maybe other offer types), sometimes,
    // despite the redirection URL used here, the actual checkout URL is
    // different than the checkout URL associated with the invoice URL.
    // If this occurs, no conversion is tracked for the order. Somehow this
    // seems to remedy the problem.
    setTimeout(() => {
      // Redirect to the draft order checkout URL.
      window.location.href = getCookie('greatupsellsDraftOrderInvoiceUrl');
    }, 100);
  };

  const handleThankYouPageAddProductBundle = async () => {
    setAddingProductBundle(true);

    await handleAddProductBundle();

    // This timeout serves as a workaround. For some strange reason, with
    // Thank You Page offers (and maybe other offer types), sometimes,
    // despite the redirection URL used here, the actual checkout URL is
    // different than the checkout URL associated with the invoice URL.
    // If this occurs, no conversion is tracked for the order. Somehow this
    // seems to remedy the problem.
    setTimeout(() => {
      // Redirect to the draft order checkout URL.
      window.location.href = getCookie('greatupsellsDraftOrderInvoiceUrl');
    }, 100);
  };

  usePushStateListener(() => {
    setProductBundleAdded(false);
  });

  useEffect(() => {
    if (!productBundleAdded) {
      return;
    }

    if (typeof actionButtonUrl === 'string') {
      window.location.href = actionButtonUrl;
    } else if (typeof actionButtonUrl === 'function') {
      actionButtonUrl();
    }
  }, [productBundleAdded, actionButtonUrl]);

  return {
    strategy,
    enableBundling,
    performActionOnAdd,
    enableVariantSelection,
    enableQuantitySelection,
    triggerProduct: translatedTriggerProduct,
    offeredProducts: translatedOfferedProducts,
    addedQuantities,
    shopifyCartTotal,
    shopifyCartTotalFormatted,
    shopifyCartItemCount,
    actionButtonUrl,
    actionButtonTarget,
    subtotalFormatted,
    savingsFormatted,
    selectedVariants,
    selectedQuantities,
    maxQuantities,
    addingProductEnabled,
    replacingProductEnabled,
    addProductBundleEnabled,
    addingProduct,
    addingProductBundle,
    handleVariantChange,
    handleQuantityChange,
    handleAddProduct,
    handleAddProductBundle,
    handleReplaceProduct,
    handleThankYouPageAddProduct,
    handleThankYouPageAddProductBundle,
    ...handlers
  };
};

export default useOfferThemeState;
