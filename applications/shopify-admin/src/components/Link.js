import React from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import qs from 'querystringify';

const Link = ({ url, external, prefetch, children, ...props }) => {
  if (external || url.match(/^https?:/)) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  const [baseUrl, queryString] = url.split('?');
  const params = queryString ? qs.parse(queryString) : {};
  const { shop } = sessionStorage;

  // Append the shop to the URL as a query string parameter.
  if (shop && !params.shop) {
    params.shop = shop;
  }

  // Include `shop` as a URL parameter to internal links to allow links to be opened in new tabs.
  const updatedUrl = `${baseUrl}${qs.stringify(params, true)}`;

  return (
    <NextLink href={updatedUrl} prefetch={prefetch}>
      <a {...props}>{children}</a>
    </NextLink>
  );
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
