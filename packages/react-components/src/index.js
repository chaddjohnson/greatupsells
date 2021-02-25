export { default as Banner } from './Banner';
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as Loader } from './Loader';
export { default as OfferPopup } from './OfferPopup';

// Expose a global interface to enable themes to programmatically interface with popups.
if (typeof window !== 'undefined') {
  window.OfferPopup = {};
}
