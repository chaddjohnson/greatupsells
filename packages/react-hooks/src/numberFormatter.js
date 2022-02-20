import { useCallback } from 'react';

const useNumberFormatter = ({ locale = 'en', countryCode = 'US' }) => {
  const formatNumber = useCallback(
    (value, decimals = 2) => {
      const formatter = new Intl.NumberFormat(`${locale}-${countryCode}`, {
        style: 'decimal',
        maximumFractionDigits: decimals
      });

      return formatter.format(value);
    },
    [locale, countryCode]
  );

  const formatPercentage = useCallback(
    (value, decimals = 2) => {
      const formatter = new Intl.NumberFormat(`${locale}-${countryCode}`, {
        style: 'percent',
        maximumFractionDigits: decimals
      });

      return formatter.format(value);
    },
    [locale, countryCode]
  );

  return {
    formatNumber,
    formatPercentage
  };
};

export default useNumberFormatter;
