import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Snackbar, Slide } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const ToastContext = createContext(null);

const ToastProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const showSuccessToast = (successMessage) => {
    setMessage(successMessage);
    setType('success');
    setOpen(true);
  };

  const showErrorToast = (errorMessage) => {
    setMessage(errorMessage);
    setType('error');
    setOpen(true);
  };

  return (
    <ToastContext.Provider
      value={{
        showSuccessToast,
        showErrorToast
      }}
    >
      {children}
      <Snackbar
        open={open}
        autoHideDuration={1000 * 6}
        TransitionComponent={(props) => <Slide direction="up" {...props} />}
        onClose={handleClose}
      >
        <Alert elevation={6} variant="filled" onClose={handleClose} severity={type}>
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired
};

const useToast = () => useContext(ToastContext);

export { ToastProvider, useToast };
