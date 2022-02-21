import React, { useMemo, useCallback } from 'react';

const loadScripts = () => {
  const scriptUrls = ['https://cdn.shopify.com/s/javascripts/currencies.js'];

  scriptUrls.forEach((scriptUrl) => {
    const script = document.createElement('script');

    script.type = 'text/javascript';
    script.src = scriptUrl;
    script.async = true;

    document.head.appendChild(script);
  });
};

const useCurrency = ({
  locale = 'en',
  countryCode = 'US',
  currency = 'USD'
}) => {
  const currencyFormatter = useMemo(() => {
    if (!locale || !countryCode || !currency) {
      return;
    }

    return new Intl.NumberFormat(`${locale}-${countryCode}`, {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol'
    });
  }, [locale, countryCode, currency]);

  const formatCurrency = useCallback(
    (value) => {
      if (currencyFormatter?.format) {
        return currencyFormatter.format(value) || value;
      }

      return value;
    },
    [currencyFormatter]
  );

  // Depends on https://cdn.shopify.com/s/javascripts/currencies.js being loaded.
  const convertCurrency = (amount, from, to) => {
    if (!window.Currency?.convert) {
      return amount;
    }

    return window.Currency.convert(amount, from, to);
  };

  const getCurrencySymbol = useCallback(() => {
    const parts = currencyFormatter?.formatToParts(currency);
    const currencyPart = parts?.find(({ type }) => type === 'currency');
    const currencySymbol = currencyPart?.value;

    return currencySymbol || '$';
  }, [currency, currencyFormatter]);

  return {
    formatCurrency,
    convertCurrency,
    getCurrencySymbol
  };
};

if (typeof window !== 'undefined') {
  loadScripts();
}

export default useCurrency;
