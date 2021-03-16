import React from 'react';
import PropTypes from 'prop-types';
import {
  ResourceList,
  Thumbnail,
  ResourceItem,
  Button,
  Stack
} from '@shopify/polaris';
import { CancelSmallMinor } from '@shopify/polaris-icons';
import styled from 'styled-components';

const ResourceListWrapper = styled.div`
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

const ManagedResourceList = ({ items, onChange, onRemoveItem }) => {
  const removeItem = (index) => [
    ...items.slice(0, index),
    ...items.slice(index + 1)
  ];

  return (
    <ResourceListWrapper>
      <ResourceList
        items={items}
        onSelectionChange={onChange}
        renderItem={({ title, imageUrl }, id, index) => (
          <ResourceItem
            name={title}
            media={<Thumbnail source={imageUrl} alt={title} size="small" />}
            verticalAlignment="center"
          >
            <Stack alignment="center">
              <Stack.Item fill>{title}</Stack.Item>
              <Button
                icon={CancelSmallMinor}
                plain
                onClick={() => onRemoveItem(removeItem(index, items))}
              />
            </Stack>
          </ResourceItem>
        )}
      />
    </ResourceListWrapper>
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
