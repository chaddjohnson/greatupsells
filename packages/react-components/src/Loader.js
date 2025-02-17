import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const DefaultLoadingComponent = () => <div>Loading...</div>;

const DefaultErrorComponent = () => (
  <div style={{ color: '#DE3618' }}>An unexpected error occurred. Please try again shortly.</div>
);

const DefaultEmptyStateComponent = () => <div>No items found.</div>;

const Loader = ({
  isLoading,
  isError,
  isEmpty,
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  emptyStateComponent: EmptyStateComponent,
  children
}) => {
  useEffect(() => {
    if (isLoading) {
      window.shopify.loading(true);
      return;
    }

    if (isError) {
      window.shopify.loading(false);
      return;
    }

    window.shopify.loading(false);
  }, [isLoading, isError]);

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

Loader.defaultProps = {
  loadingComponent: DefaultLoadingComponent,
  errorComponent: DefaultErrorComponent,
  emptyStateComponent: DefaultEmptyStateComponent
};

export default Loader;
