import PropTypes from 'prop-types';
import { ResourceList, Thumbnail } from '@shopify/polaris';
import ManagedResourceItem from './ManagedResourceItem';

const removeItem = (index, items = []) => [
  ...items.slice(0, index),
  ...items.slice(index + 1)
];

const ManagedResourceList = ({ items, onChange, onItemRemoved }) => (
  <ResourceList
    items={items}
    onSelectionChange={onChange}
    renderItem={({ title, image }, id, index) => (
      <ManagedResourceItem
        media={<Thumbnail source={image.src} alt={title} size="small" />}
        onRemove={() => onItemRemoved(removeItem(index, items))}
      >
        {title}
      </ManagedResourceItem>
    )}
  />
);

ManagedResourceList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      image: PropTypes.shape({
        src: PropTypes.string.isRequired
      }).isRequired
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
