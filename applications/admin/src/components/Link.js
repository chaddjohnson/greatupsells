import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';

const Link = forwardRef(({ href, children, ...props }, ref) => (
  <NextLink href={href} {...props}>
    <a ref={ref} {...props}>
      {children}
    </a>
  </NextLink>
));

Link.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node
};

export default Link;
