import React from 'react';
import PropTypes from 'prop-types';

const DefaultLoadingComponent = () => <div>Loading...</div>;

const DefaultErrorComponent = ({ children }) => (
  <div style={{ color: '#DE3618' }}>{children}</div>
);

const Loader = ({
  isLoading,
  isError,
  isEmpty,
  error,
  empty,
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  children
}) => {
  if (isError) {
    return <ErrorComponent>{error}</ErrorComponent>;
  }

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (!isLoading && !isError && isEmpty) {
    return empty;
  }

  return children;
};

Loader.propTypes = {
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  isEmpty: PropTypes.bool,
  error: PropTypes.node,
  empty: PropTypes.node,
  loadingComponent: PropTypes.elementType,
  errorComponent: PropTypes.elementType,
  children: PropTypes.node
};

Loader.defaultProps = {
  loadingComponent: DefaultLoadingComponent,
  errorComponent: DefaultErrorComponent,
  error: 'An unexpected error occurred. Please try again later.',
  empty: 'No items found.'
};

export default Loader;
