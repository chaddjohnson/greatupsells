import React from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';

const useToast = () => {
  const shopify = useAppBridge();

  const showSuccessToast = (message) => {
    shopify.toast.show(message, {
      duration: 5 * 1000,
      isError: false
    });
  };

  const showErrorToast = (message) => {
    shopify.toast.show(message, {
      duration: 5 * 1000,
      isError: true
    });
  };

  return { showSuccessToast, showErrorToast };
};

export default useToast;
