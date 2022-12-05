const useShopifyCustomer = () => {
  // Reference: https://stackoverflow.com/a/52112155/83897
  const localeAndCountryCode = navigator.languages?.length
    ? navigator.languages[0]
    : navigator.userLanguage ||
      navigator.language ||
      navigator.browserLanguage ||
      navigator.systemLanguage ||
      'en-US';

  const getCustomerLocale = () => {
    const parts = localeAndCountryCode.split('-');

    return parts[0] || 'en';
  };

  const getCustomerCountryCode = () => {
    const parts = localeAndCountryCode.split('-');

    return parts[1]?.toUpperCase() || 'US';
  };

  const getCustomerLocaleAndCountryCode = () => {
    return localeAndCountryCode;
  };

  return {
    getCustomerLocale,
    getCustomerCountryCode,
    getCustomerLocaleAndCountryCode
  };
};

export default useShopifyCustomer;
