import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    const { message = 'An unexpected error occurred. Please try again later.', children } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return <div style={{ color: '#DE3618' }}>{message}</div>;
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  message: PropTypes.node,
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;
