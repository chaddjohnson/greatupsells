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
  const [changes, setChanges] = useState([]);
  const [calculatedPurchase, setCalculatedPurchase] = useState();

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
    calculatedPurchase?.totalOutstandingSet.presentmentMoney.currencyCode;
  const { formatCurrency } = useCurrency({ locale, countryCode, currency });
  const { findTriggerProductShopifyVariantId } = useShopifyCart(
    shopifyCartItems
  );
  const singleOfferedProduct = offeredProducts.length === 1;

  const handleAddProduct = async (offerId, items) => {
    // TODO Handle multiple items (bundle offers)?
    const [{ shopifyProductId, shopifyVariantId, quantity }] = items;
    const product = offeredProducts.find(
      ({ shopifyProductData }) => shopifyProductData.id === shopifyProductId
    );
    const variant = product?.shopifyProductData.variants.find(
      ({ id }) => id === shopifyVariantId
    );
    const change = buildChange(offer, variant, quantity);
    const updatedChanges = [...changes, change];
    const changeset = await calculateChangeset({
      changes: updatedChanges
    });
    let changesetToken;

    setChanges(updatedChanges);
    setCalculatedPurchase(changeset.calculatedPurchase);

    if (singleOfferedProduct) {
      changesetToken = await signChangeset(referenceId, updatedChanges, token);

      await trackOfferAcceptance(offerId, items, referenceId);
      await applyChangeset(changesetToken);

      done();
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

  const subtotalPrice = useMemo(
    () => calculateSubtotalPrice(calculatedPurchase),
    [calculatedPurchase] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const subtotalPriceFormatted = useMemo(() => {
    const [presentmentAmount, presentmentCurrency] = calculateSubtotalPrice(
      calculatedPurchase
    );
    const formattedPresentmentAmount = formatCurrency(
      presentmentAmount,
      presentmentCurrency
    );

    return formattedPresentmentAmount;
  }, [formatCurrency, calculatedPurchase]); // eslint-disable-line react-hooks/exhaustive-deps

  const shippingPrice = useMemo(
    () => calculateShippingPrice(calculatedPurchase),
    [calculatedPurchase] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const shippingPriceFormatted = useMemo(() => {
    const [presentmentAmount, presentmentCurrency] = calculateShippingPrice(
      calculatedPurchase
    );
    const formattedPresentmentAmount = formatCurrency(
      presentmentAmount,
      presentmentCurrency
    );

    return formattedPresentmentAmount;
  }, [formatCurrency, calculatedPurchase]); // eslint-disable-line react-hooks/exhaustive-deps

  const taxPrice = useMemo(
    () => calculateTaxPrice(calculatedPurchase),
    [calculatedPurchase] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const taxPriceFormatted = useMemo(() => {
    const [presentmentAmount, presentmentCurrency] = calculateTaxPrice(
      calculatedPurchase
    );
    const formattedPresentmentAmount = formatCurrency(
      presentmentAmount,
      presentmentCurrency
    );

    return formattedPresentmentAmount;
  }, [formatCurrency, calculatedPurchase]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalPrice = useMemo(
    () => calculateTotalPrice(calculatedPurchase),
    [calculatedPurchase] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const totalPriceFormatted = useMemo(() => {
    const [presentmentAmount, presentmentCurrency] = calculateTotalPrice(
      calculatedPurchase
    );
    const formattedPresentmentAmount = formatCurrency(
      presentmentAmount,
      presentmentCurrency
    );

    return formattedPresentmentAmount;
  }, [formatCurrency, calculatedPurchase]); // eslint-disable-line react-hooks/exhaustive-deps

  const calculatePrices = useCallback(async () => {
    const potentialChanges = [...changes];
    const { selectedVariants, selectedQuantities } = state;

    // Include the offered product in the changeset calculation if there is only one offered product.
    if (singleOfferedProduct) {
      potentialChanges.push(
        buildChange(offer, selectedVariants[0], selectedQuantities[0])
      );
    }

    const changeset = await calculateChangeset({
      changes: potentialChanges
    });

    setCalculatedPurchase(changeset.calculatedPurchase);
  }, [changes, state.selectedVariants, state.selectedQuantities]); // eslint-disable-line react-hooks/exhaustive-deps

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
        subtotalPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        subtotalPriceFormatted,
        shippingPriceFormatted,
        taxPriceFormatted,
        totalPriceFormatted,
        pricesLoading: !calculatedPurchase
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
