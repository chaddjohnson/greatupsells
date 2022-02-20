import React from 'react';
import { useCookies } from '@greatupsells/react-hooks';

const useShopifyCustomer = () => {
  const { getCookie } = useCookies();

  const getCustomerLocale = () => {
    const language = navigator.languages?.length
      ? navigator.languages[0]
      : navigator.userLanguage ||
        navigator.language ||
        navigator.browserLanguage ||
        navigator.systemLanguage ||
        'en-US';
    const parts = language.split('-');

    return parts[0] || 'en';
  };

  const getCustomerCountryCode = () => {
    const language = navigator.languages?.length
      ? navigator.languages[0]
      : navigator.userLanguage ||
        navigator.language ||
        navigator.browserLanguage ||
        navigator.systemLanguage ||
        'en-US';
    const parts = language.split('-');

    return parts[1] || 'US';
  };

  const getCustomerCurrency = () => {
    // Determine the customer's selected currency. Different Shopify apps track this in different ways.
    return (
      getCookie('currencynewcookie') ||
      localStorage.getItem('currency') ||
      getCookie('boldCurrencyCookie') ||
      getCookie('acscurrency') ||
      localStorage.getItem('__v_cc__s_c__') ||
      (localStorage.getItem('cbb-currency-converter-currency') &&
        JSON.parse(localStorage.getItem('cbb-currency-converter-currency'))
          ?.value) ||
      (localStorage.getItem('spurit-global-multitabs.cart') &&
        JSON.parse(localStorage.getItem('spurit-global-multitabs.cart'))
          ?.currency) ||
      localStorage.getItem('T4Currency') ||
      localStorage.getItem('currencyWidget') ||
      getCookie('pb_cur_65271') ||
      getCookie('currency') ||
      document.querySelector('.currency-switcher .current')?.innerText.trim() ||
      document.querySelector('.pb_currency_name')?.innerText.trim() ||
      (sessionStorage.getItem('bacurr_user_cur') &&
        JSON.parse(sessionStorage.getItem('bacurr_user_cur'))) ||
      document.querySelector('.ba-chosen')?.innerText.trim() ||
      getCookie('cart_currency')
    );
  };

  return { getCustomerLocale, getCustomerCountryCode, getCustomerCurrency };
};

export default useShopifyCustomer;
