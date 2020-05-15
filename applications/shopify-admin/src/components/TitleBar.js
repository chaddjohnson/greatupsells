import { TitleBar } from '@shopify/app-bridge-react';
import { useRouter } from 'next/router';

export default (props) => {
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
          content: 'FAQ',
          url: 'https://help.domain.com/faq',
          external: true
        }
      ]
    }
  ];

  return (
    <TitleBar
      primaryAction={primaryAction}
      secondaryActions={secondaryActions}
      actionGroups={actionGroups}
      {...props}
    />
  );
};
