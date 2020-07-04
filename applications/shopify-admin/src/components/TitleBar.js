import { TitleBar as ShopifyTitleBar } from '@shopify/app-bridge-react';
import { useRouter } from 'next/router';

const TitleBar = (props) => {
  const router = useRouter();

  const primaryAction = {
    content: 'Create offer',
    onAction: () => router.push('/offers/new')
  };
  const secondaryActions = [
    {
      content: 'Dashboard',
      onAction: () => router.push('/')
    },
    {
      content: 'Offers',
      onAction: () => router.push('/offers')
    },
    {
      content: 'Settings',
      onAction: () => router.push('/settings')
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
