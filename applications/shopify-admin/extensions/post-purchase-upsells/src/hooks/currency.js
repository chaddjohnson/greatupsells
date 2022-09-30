import React from 'react';
import useShopifyCustomer from './shopifyCustomer';

const useCurrency = () => {
  const { getCustomerLocaleAndCountryCode } = useShopifyCustomer();

  const formatCurrency = (value, currency) => {
    if (!value || parseInt(value) === 0) {
      return 'Free';
    }
    if (!currency) {
      return value;
    }

    const localeAndCountryCode = getCustomerLocaleAndCountryCode();

    const currencyFormatter = new Intl.NumberFormat(localeAndCountryCode, {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: 2
    });

    if (currencyFormatter?.format) {
      return currencyFormatter.format(value) || value;
    }

    return value;
  };

  return { formatCurrency };
};

export default useCurrency;
