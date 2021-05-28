import { useMemo } from 'react';

const useNumberFormatter = ({ locale, countryCode, currency }) => {
  const numberFormatter = useMemo(() => {
    if (!locale || !countryCode) {
      return;
    }

    return new Intl.NumberFormat(`${locale}-${countryCode}`);
  }, [locale, countryCode]);

  const currencyFormatter = useMemo(() => {
    if (!locale || !countryCode || !currency) {
      return;
    }

    return new Intl.NumberFormat(`${locale}-${countryCode}`, {
      style: 'currency',
      currency
    });
  }, [locale, countryCode, currency]);

  const formatNumber = (value, decimals = 2) => {
    if (numberFormatter?.format) {
      return (
        numberFormatter.format(
          Math.round(value * 10 ** decimals) / 10 ** decimals
        ) || value
      );
    }

    return value;
  };

  const formatCurrency = (value) => {
    if (currencyFormatter?.format) {
      return currencyFormatter.format(value) || value;
    }

    return value;
  };

  const formatPercentage = (value, decimals = 2) => {
    if (numberFormatter?.format) {
      const formattedValue =
        Math.round(value * 100 * 10 ** decimals) / 10 ** decimals;

      return typeof formattedValue === 'number'
        ? `${numberFormatter.format(formattedValue)}%`
        : value;
    }

    return value;
  };

  return { formatNumber, formatCurrency, formatPercentage };
};

export default useNumberFormatter;
