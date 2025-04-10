import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAppBridge } from '@shopify/app-bridge-react';

const DefaultLoadingComponent = () => <div>Loading...</div>;

const DefaultErrorComponent = () => (
  <div style={{ color: '#DE3618' }}>An unexpected error occurred. Please try again shortly.</div>
);

const DefaultEmptyStateComponent = () => <div>No items found.</div>;

const Loader = ({
  isLoading,
  isError,
  isEmpty,
  loadingComponent: LoadingComponent = DefaultLoadingComponent,
  errorComponent: ErrorComponent = DefaultErrorComponent,
  emptyStateComponent: EmptyStateComponent = DefaultEmptyStateComponent,
  children
}) => {
  const shopify = useAppBridge();

  useEffect(() => {
    if (isLoading) {
      shopify.loading(true);
      return;
    }

    if (isError) {
      shopify.loading(false);
      return;
    }

    shopify.loading(false);
  }, [shopify, isLoading, isError]);

  if (isError) {
    return <ErrorComponent />;
  }

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (!isLoading && !isError && isEmpty) {
    return <EmptyStateComponent />;
  }

  return children;
};

Loader.propTypes = {
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  isEmpty: PropTypes.bool,
  error: PropTypes.node,
  loadingComponent: PropTypes.elementType,
  errorComponent: PropTypes.elementType,
  emptyStateComponent: PropTypes.elementType,
  children: PropTypes.node
};

export default Loader;
