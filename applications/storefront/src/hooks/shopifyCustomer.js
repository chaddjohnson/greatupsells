import { getParamByISO } from 'iso-country-currency';
import React from 'react';
import { useCookies } from '@greatupsells/react-hooks';

const useShopifyCustomer = () => {
  const { getCookie } = useCookies();

  const localeAndCountryCode = navigator.languages?.length
    ? navigator.languages[0]
    : navigator.userLanguage || navigator.language || navigator.browserLanguage || navigator.systemLanguage || 'en-US';

  const getCustomerLocale = () => {
    const urlLocale = window.location.pathname.match(/^\/([a-z]{2})-[a-z]{2}(\/|$)/)?.[1];

    // Reference: https://stackoverflow.com/a/52112155/83897
    const language = urlLocale || localeAndCountryCode;
    const parts = language.split('-');

    return parts[0] || 'en';
  };

  const getCustomerCountryCode = () => {
    const urlCountryCode = window.location.pathname.match(/^\/[a-z]{2}-([a-z]{2})(\/|$)/)?.[1]?.toUpperCase();

    // Reference: https://stackoverflow.com/a/52112155/83897
    const language = urlCountryCode || localeAndCountryCode;
    const parts = language.split('-');

    return parts[1]?.toUpperCase() || 'US';
  };

  const getUrlLocaleAndCountryCode = () => {
    if (window.Shopify?.routes?.root) {
      return window.Shopify.routes.root.replace(/\//g, '') || '';
    }

    return window.location.pathname.match(/^\/([a-z]{2}-[a-z]{2})(\/|$)/)?.[1] || '';
  };

  const getUrlPrefix = () => {
    const urlLocale = getUrlLocaleAndCountryCode();

    return `/${urlLocale}`.replace(/\/$/, '');
  };

  const getCustomerCurrency = () => {
    const urlCountryCode = window.location.pathname.match(/^\/[a-z]{2}-([a-z]{2})(\/|$)/)?.[1]?.toUpperCase();

    if (urlCountryCode) {
      // Get the currency code for the country code.
      return getParamByISO(urlCountryCode, 'currency');
    }

    // Determine the customer's selected currency. Different Shopify apps track this in different ways.
    return (
      getCookie('currencynewcookie') ||
      localStorage.getItem('currency') ||
      getCookie('boldCurrencyCookie') ||
      getCookie('acscurrency') ||
      localStorage.getItem('__v_cc__s_c__') ||
      (localStorage.getItem('cbb-currency-converter-currency') &&
        JSON.parse(localStorage.getItem('cbb-currency-converter-currency'))?.value) ||
      (localStorage.getItem('spurit-global-multitabs.cart') &&
        JSON.parse(localStorage.getItem('spurit-global-multitabs.cart'))?.currency) ||
      localStorage.getItem('T4Currency') ||
      localStorage.getItem('currencyWidget') ||
      getCookie('pb_cur_65271') ||
      getCookie('currency') ||
      document.querySelector('.currency-switcher .current')?.textContent.trim() ||
      document.querySelector('.pb_currency_name')?.textContent.trim() ||
      (sessionStorage.getItem('bacurr_user_cur') && JSON.parse(sessionStorage.getItem('bacurr_user_cur'))) ||
      document.querySelector('.ba-chosen')?.textContent.trim() ||
      getCookie('cart_currency')
    );
  };

  return {
    getCustomerLocale,
    getCustomerCountryCode,
    getUrlLocaleAndCountryCode,
    getUrlPrefix,
    getCustomerCurrency
  };
};

export default useShopifyCustomer;
