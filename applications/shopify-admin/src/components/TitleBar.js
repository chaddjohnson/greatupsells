import React from 'react';
import { TitleBar as ShopifyTitleBar } from '@shopify/app-bridge-react';
import { useRouter } from 'next/router';

const TitleBar = ({ children, ...props }) => {
  const router = useRouter();

  // Include `shop` as a URL parameter to internal links to allow links to be opened in new tabs.
  const urlParams = sessionStorage.shop ? `?shop=${sessionStorage.shop}` : '';

  return (
    <ShopifyTitleBar {...props}>
      {children}
      <button variant="primary" onClick={() => router.push(`/offers/new/${urlParams}`)}>
        Create offer
      </button>
      <button onClick={() => router.push(`/${urlParams}`)}>Dashboard</button>
      <button onClick={() => router.push(`/offers/${urlParams}`)}>Offers</button>
    </ShopifyTitleBar>
  );
};

export default TitleBar;
