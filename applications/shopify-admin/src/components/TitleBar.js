import React from 'react';
import { TitleBar as ShopifyTitleBar } from '@shopify/app-bridge-react';

const TitleBar = (props) => {
  const primaryAction = {
    content: 'Create offer',
    url: '/offers/new/'
  };
  const secondaryActions = [
    {
      content: 'Dashboard',
      url: '/'
    },
    {
      content: 'Offers',
      url: '/offers/'
    }
  ];
  const actionGroups = [
    {
      title: 'Help',
      actions: [
        {
          content: 'Support',
          onAction: () => {}
        },
        {
          content: 'Help Center',
          url: 'https://help.domain.com',
          external: true
        },
        {
          content: 'Tutorials',
          url: 'https://help.domain.com/tutorials',
          external: true
        },
        {
          content: 'FAQ',
          url: 'https://help.domain.com/faq',
          external: true
        }
      ]
    }
  ];

  return (
    <ShopifyTitleBar
      primaryAction={primaryAction}
      secondaryActions={secondaryActions}
      actionGroups={actionGroups}
      {...props}
    />
  );
};

export default TitleBar;
