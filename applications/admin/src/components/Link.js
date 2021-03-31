import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { Link as MuiLink } from '@material-ui/core';

const Link = forwardRef(({ href, children, ...props }, ref) => (
  <NextLink href={href} passHref>
    <MuiLink ref={ref} {...props}>
      {children}
    </MuiLink>
  </NextLink>
));

Link.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node
};

export default Link;
