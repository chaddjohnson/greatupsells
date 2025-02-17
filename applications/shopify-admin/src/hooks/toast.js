import React from 'react';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Toast } from '@shopify/app-bridge/actions';

const useToast = () => {
  const app = useAppBridge();

  const showSuccessToast = (message, options = {}) => {
    Toast.create(app, {
      message,
      duration: 5 * 1000,
      isError: false,
      ...options
    }).dispatch(Toast.Action.SHOW);
  };

  const showErrorToast = (message, options = {}) => {
    Toast.create(app, {
      message,
      duration: 5 * 1000,
      isError: true,
      ...options
    }).dispatch(Toast.Action.SHOW);
  };

  return { showSuccessToast, showErrorToast };
};

export default useToast;
