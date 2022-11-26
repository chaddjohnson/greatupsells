import React from 'react';
import { TitleBar as ShopifyTitleBar } from '@shopify/app-bridge-react';

const TitleBar = (props) => {
  // Include `shop` as a URL parameter to internal links to allow links to be opened in new tabs.
  const urlParams = sessionStorage.shop ? `?shop=${sessionStorage.shop}` : '';

  const primaryAction = {
    content: 'Create offer',
    url: `/offers/new/${urlParams}`
  };
  const secondaryActions = [
    {
      content: 'Dashboard',
      url: `/${urlParams}`
    },
    {
      content: 'Offers',
      url: `/offers/${urlParams}`
    }
  ];
  // const actionGroups = [
  //   {
  //     title: 'Help',
  //     actions: [
  //       {
  //         content: 'Support',
  //         onAction: () => {}
  //       },
  //       {
  //         content: 'Help Center',
  //         url: 'https://help.domain.com',
  //         external: true
  //       },
  //       {
  //         content: 'Tutorials',
  //         url: 'https://help.domain.com/tutorials',
  //         external: true
  //       },
  //       {
  //         content: 'FAQ',
  //         url: 'https://help.domain.com/faq',
  //         external: true
  //       }
  //     ]
  //   }
  // ];

  return (
    <ShopifyTitleBar
      primaryAction={primaryAction}
      secondaryActions={secondaryActions}
      // actionGroups={actionGroups}
      {...props}
    />
  );
};

export default TitleBar;
