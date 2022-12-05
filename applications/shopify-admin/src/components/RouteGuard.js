import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useShop } from '../hooks';

const RouteGuard = ({ children }) => {
  const router = useRouter();
  const { shop } = useShop();

  // Render children if shop has a plan and is active.
  if (!shop || (shop.plan.level && shop.plan.active)) {
    return children;
  }

  // Redirect to Plan page if shop has no plan.
  if (!shop.plan.active && router.pathname !== '/plan') {
    router.replace('/plan');
  }

  // Allow Plan page to render.
  if (!shop.plan.active && router.pathname === '/plan') {
    return children;
  }

  return null;
};

RouteGuard.propTypes = {
  children: PropTypes.node.isRequired
};

export default RouteGuard;
