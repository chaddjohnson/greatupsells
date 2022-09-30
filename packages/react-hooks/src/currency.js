import React, { useMemo, useCallback } from 'react';

const loadScripts = async () => {
  const scriptUrl = 'https://cdn.shopify.com/s/javascripts/currencies.js';

  if (typeof window !== 'undefined') {
    const script = document.createElement('script');

    script.type = 'text/javascript';
    script.src = scriptUrl;
    script.async = true;

    document.head.appendChild(script);
  }
  // eslint-disable-next-line no-restricted-globals
  else if (typeof self !== 'undefined') {
    // Load within web worker using fetch.
    const response = await fetch(scriptUrl);
    const text = await response.text();

    // eslint-disable-next-line no-restricted-globals
    self.eval(text);
  }
};

const useCurrency = ({
  locale = 'en',
  countryCode = 'US',
  currency = 'USD',
  options = {
    decimals: 2
  }
}) => {
  const currencyFormatter = useMemo(() => {
    if (!locale || !countryCode || !currency) {
      return;
    }

    return new Intl.NumberFormat(`${locale}-${countryCode}`, {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: options.decimals
    });
  }, [locale, countryCode, currency, options]);

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
    // eslint-disable-next-line no-restricted-globals
    if (typeof self !== 'undefined' && !self?.Currency?.convert) {
      return amount;
    }

    // eslint-disable-next-line no-restricted-globals
    return self.Currency.convert(amount, from, to);
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

loadScripts();

export default useCurrency;
