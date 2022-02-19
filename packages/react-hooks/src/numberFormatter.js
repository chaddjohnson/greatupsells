import { useMemo, useCallback } from 'react';

const useNumberFormatter = ({ locale, countryCode }) => {
  const numberFormatter = useMemo(() => {
    if (!locale || !countryCode) {
      return;
    }

    return new Intl.NumberFormat(`${locale}-${countryCode}`);
  }, [locale, countryCode]);

  const formatNumber = useCallback(
    (value, decimals = 2) => {
      if (numberFormatter?.format) {
        return (
          numberFormatter.format(
            Math.round(parseFloat(value) * 10 ** decimals) / 10 ** decimals
          ) || value
        );
      }

      return value;
    },
    [numberFormatter]
  );

  const formatPercentage = useCallback(
    (value, decimals = 2) => {
      if (numberFormatter?.format) {
        const formattedValue =
          Math.round(parseFloat(value) * 100 * 10 ** decimals) / 10 ** decimals;

        return typeof formattedValue === 'number'
          ? `${numberFormatter.format(formattedValue)}%`
          : value;
      }

      return value;
    },
    [numberFormatter]
  );

  return {
    formatNumber,
    formatPercentage
  };
};

export default useNumberFormatter;
