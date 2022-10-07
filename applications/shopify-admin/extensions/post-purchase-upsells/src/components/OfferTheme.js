import React, { useState, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useExtensionInput } from '@shopify/post-purchase-ui-extensions-react';
import {
  useThemeComponent,
  useOfferTracking,
  useCurrency,
  useShopifyCustomer,
  useShopifyCart,
  useChangeset
} from '../hooks';

// TODO Import from package if possible.
import useOfferThemeState from '../../../../../../packages/react-components/src/OfferTheme/offerThemeState';
import useOfferThemeVariables from '../../../../../../packages/react-components/src/OfferTheme/offerThemeVariables';

const OfferTheme = ({
  shop,
  offer,
  theme,
  triggerProduct,
  offeredProducts,
  shopifyCartItems,
  shopifyCartTotal,
  shopifyCartItemCount,
  referenceId,
  token
}) => {
  const [calculatedPurchases, setCalculatedPurchases] = useState([]);
  const [pricesLoading, setPricesLoading] = useState(false);
  const [pricesError, setPricesError] = useState();

  const themeVariables = useOfferThemeVariables(offer, theme);
  const ThemeComponent = useThemeComponent(theme?.key);
  const { trackOfferImpression, trackOfferAcceptance } = useOfferTracking();
  const { getCustomerLocale, getCustomerCountryCode } = useShopifyCustomer();
  const { calculateChangeset, applyChangeset, done } = useExtensionInput();
  const {
    buildChange,
    calculateSubtotalPrice,
    calculateShippingPrice,
    calculateTaxPrice,
    calculateTotalPrice,
    signChangeset
  } = useChangeset();
  const locale = getCustomerLocale();
  const countryCode = getCustomerCountryCode();
  const currency =
    calculatedPurchases[0]?.totalOutstandingSet.presentmentMoney.currencyCode;
  const { formatCurrency } = useCurrency({ locale, countryCode, currency });
  const { findTriggerProductShopifyVariantId } = useShopifyCart(
    shopifyCartItems
  );

  const handleAddProduct = async (offerId, items) => {
    try {
      // TODO Handle multiple items (bundle offers)?
      const [{ shopifyProductId, shopifyVariantId, quantity }] = items;
      const product = offeredProducts.find(
        ({ shopifyProductData }) => shopifyProductData.id === shopifyProductId
      );
      const variant = product?.shopifyProductData.variants.find(
        ({ id }) => id === shopifyVariantId
      );
      const change = buildChange(offer, variant, quantity);
      const changesetToken = await signChangeset(referenceId, [change], token);

      await trackOfferAcceptance(offerId, items, referenceId);
      await applyChangeset(changesetToken);

      done();
    } catch (error) {
      setPricesError(
        `There was an error adding the product: ${error.code || error.message}`
      );
    }
  };

  const state = useOfferThemeState({
    shop,
    offer,
    locale,
    countryCode,
    currency,
    triggerProduct,
    offeredProducts,
    shopifyCartItems,
    shopifyCartTotal,
    shopifyCartItemCount,
    onAddProducts: handleAddProduct,
    handlers: {
      handleClose: done
    }
  });

  const subtotalPricesFormatted = useMemo(() => {
    return calculatedPurchases.map((calculatedPurchase) => {
      const [presentmentAmount, presentmentCurrency] = calculateSubtotalPrice(
        calculatedPurchase
      );
      const formattedPresentmentAmount = formatCurrency(
        presentmentAmount,
        presentmentCurrency
      );

      return formattedPresentmentAmount;
    });
  }, [formatCurrency, calculatedPurchases]); // eslint-disable-line react-hooks/exhaustive-deps

  const shippingPricesFormatted = useMemo(
    () =>
      calculatedPurchases.map((calculatedPurchase) => {
        const [presentmentAmount, presentmentCurrency] = calculateShippingPrice(
          calculatedPurchase
        );
        const formattedPresentmentAmount = formatCurrency(
          presentmentAmount,
          presentmentCurrency
        );

        return formattedPresentmentAmount;
      }),
    [formatCurrency, calculatedPurchases] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const taxPricesFormatted = useMemo(
    () =>
      calculatedPurchases.map((calculatedPurchase) => {
        const [presentmentAmount, presentmentCurrency] = calculateTaxPrice(
          calculatedPurchase
        );
        const formattedPresentmentAmount = formatCurrency(
          presentmentAmount,
          presentmentCurrency
        );

        return formattedPresentmentAmount;
      }),
    [formatCurrency, calculatedPurchases] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const totalPrices = useMemo(
    () =>
      calculatedPurchases.map(
        (calculatedPurchase) => calculateTotalPrice(calculatedPurchase)?.[0]
      ),
    [calculatedPurchases] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const totalPricesFormatted = useMemo(
    () =>
      calculatedPurchases.map((calculatedPurchase) => {
        const [presentmentAmount, presentmentCurrency] = calculateTotalPrice(
          calculatedPurchase
        );
        const formattedPresentmentAmount = formatCurrency(
          presentmentAmount,
          presentmentCurrency
        );

        return formattedPresentmentAmount;
      }),
    [formatCurrency, calculatedPurchases] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const calculatePrices = useCallback(async () => {
    const { selectedVariants, selectedQuantities } = state;

    setPricesLoading(true);

    try {
      const results = await Promise.all(
        offeredProducts.map(async (offeredProduct, index) => {
          const change = buildChange(
            offer,
            selectedVariants[index],
            selectedQuantities[index]
          );

          const changeset = await calculateChangeset({
            changes: [change]
          });

          return changeset.calculatedPurchase;
        })
      );

      setCalculatedPurchases(results);
    } catch (error) {
      setPricesError(
        `There was an error calculating prices: ${error.code || error.message}`
      );
    }
    setPricesLoading(false);
  }, [state.selectedVariants, state.selectedQuantities]); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate prices.
  useEffect(() => {
    calculatePrices();
  }, [calculatePrices]);

  // Track impression.
  useEffect(() => {
    const { domain } = shop;
    const offerId = offer._id;
    const triggerShopifyProductId = triggerProduct?.shopifyProductId;
    const triggerShopifyVariantId = findTriggerProductShopifyVariantId(
      triggerProduct
    );
    const offeredShopifyProductIds = offeredProducts.map(
      ({ shopifyProductData }) => shopifyProductData?.id
    );

    trackOfferImpression({
      domain,
      offerId,
      triggerShopifyProductId,
      triggerShopifyVariantId,
      offeredShopifyProductIds
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ThemeComponent) {
    return null;
  }

  return (
    <ThemeComponent
      theme={themeVariables}
      state={{
        ...state,
        subtotalPricesFormatted,
        shippingPricesFormatted,
        taxPricesFormatted,
        totalPrices,
        totalPricesFormatted,
        pricesLoading,
        pricesError
      }}
    />
  );
};

OfferTheme.propTypes = {
  shop: PropTypes.object.isRequired,
  offer: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  triggerProduct: PropTypes.object.isRequired,
  offeredProducts: PropTypes.array.isRequired,
  shopifyCartItems: PropTypes.array.isRequired,
  shopifyCartTotal: PropTypes.number.isRequired,
  shopifyCartItemCount: PropTypes.number.isRequired,
  referenceId: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired
};

export default OfferTheme;
