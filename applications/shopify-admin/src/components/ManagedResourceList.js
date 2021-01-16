import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { ResourceList, Thumbnail } from '@shopify/polaris';
import ManagedResourceItem from './ManagedResourceItem';

const ManagedResourceList = ({ items, onChange, onItemRemoved }) => {
  const removeItem = useCallback(
    (index) => [...items.slice(0, index), ...items.slice(index + 1)],
    [items]
  );

  return (
    <ResourceList
      items={items}
      onSelectionChange={onChange}
      renderItem={({ title, imageUrl }, id, index) => (
        <ManagedResourceItem
          media={<Thumbnail source={imageUrl} alt={title} size="small" />}
          onRemove={() => onItemRemoved(removeItem(index, items))}
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
  onItemRemoved: PropTypes.func
};

ManagedResourceList.defaultProps = {
  onChange: () => {},
  onItemRemoved: () => {}
};

export default ManagedResourceList;
