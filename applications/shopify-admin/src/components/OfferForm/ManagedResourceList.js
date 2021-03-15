import React from 'react';
import PropTypes from 'prop-types';
import { ResourceList, Thumbnail, ResourceItem, Icon } from '@shopify/polaris';
import { CancelSmallMinor } from '@shopify/polaris-icons';
import styled from 'styled-components';

const ManagedResourceItemWrapper = styled.div`
  cursor: default;

  .Polaris-ResourceItem {
    cursor: default;
    &:hover {
      background-image: none;
    }
  }

  .Polaris-ResourceItem__Container {
    padding-left: 0;
    align-items: center;
  }

  svg {
    fill: #5c5f62;
  }

  .Polaris-ResourceItem__ListItem:hover {
    svg {
      fill: #1a1c1d;
    }
  }
`;

const ManagedResourceItem = ({ children, onRemove, ...props }) => (
  <ManagedResourceItemWrapper>
    <ResourceItem
      shortcutActions={[
        {
          content: <Icon source={CancelSmallMinor} />,
          onAction: onRemove
        }
      ]}
      persistActions
      {...props}
    >
      {children}
    </ResourceItem>
  </ManagedResourceItemWrapper>
);

ManagedResourceItem.propTypes = {
  children: PropTypes.node.isRequired,
  onRemove: PropTypes.func.isRequired
};

const ManagedResourceList = ({ items, onChange, onRemoveItem }) => {
  const removeItem = (index) => [
    ...items.slice(0, index),
    ...items.slice(index + 1)
  ];

  return (
    <ResourceList
      items={items}
      onSelectionChange={onChange}
      renderItem={({ title, imageUrl }, id, index) => (
        <ManagedResourceItem
          media={<Thumbnail source={imageUrl} alt={title} size="small" />}
          onRemove={() => onRemoveItem(removeItem(index, items))}
        >
          {title}
        </ManagedResourceItem>
      )}
    />
  );
};

ManagedResourceList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired
    })
  ).isRequired,
  onChange: PropTypes.func,
  onRemoveItem: PropTypes.func
};

ManagedResourceList.defaultProps = {
  onChange: () => {},
  onRemoveItem: () => {}
};

export default ManagedResourceList;
