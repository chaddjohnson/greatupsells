import React from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';

const Link = ({ url, external, prefetch, children, ...props }) => {
  if (external || url.match(/^https?:/)) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  } else {
    return (
      <NextLink href={url} prefetch={prefetch}>
        <a {...props}>{children}</a>
      </NextLink>
    );
  }
};

Link.propTypes = {
  url: PropTypes.string.isRequired,
  external: PropTypes.bool,
  prefetch: PropTypes.bool,
  children: PropTypes.node.isRequired
};

Link.defaultProps = {
  external: false,
  prefetch: false
};

export default Link;
