import React from 'react';
import PropTypes from 'prop-types';
import { ShopProvider } from '@neatowebsolutions/upselling-react-hooks';

const Contexts = ({ children }) => <ShopProvider>{children}</ShopProvider>;

Contexts.propTypes = {
  children: PropTypes.node.isRequired
};

export default Contexts;
