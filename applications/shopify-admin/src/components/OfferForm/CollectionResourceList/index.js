import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ResourceList, TextField, Icon, Button } from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import { SearchIcon } from '@shopify/polaris-icons';
import styled from 'styled-components';
import CollectionResourceListItem from './CollectionResourceListItem';

const ResourceListWrapper = styled.div`
  cursor: default;

  .Polaris-ResourceItem {
    cursor: default;

    &:hover {
      background-color: inherit;
    }
  }

  .Polaris-ResourceItem__Container {
    padding-left: 0;
    padding-right: 0;
  }
`;

const formatSelectionItems = (selections) => {
  return selections.map(({ id, title, handle, image }) => ({
    title,
    handle,
    imageUrl: image?.originalSrc,
    shopifyCollectionId: parseInt(id.split('/').reverse()[0])
  }));
};

const CollectionResourceList = ({ label, items, onChange = () => {}, onRemoveItem = () => {} }) => {
  const shopify = useAppBridge();

  const initialSelectionIds = useMemo(
    () =>
      items.map(({ shopifyCollectionId }) => ({
        id: `gid://shopify/Collection/${shopifyCollectionId}`
      })),
    [items]
  );

  const handleOpenCollectionPicker = async () => {
    const selections = await shopify.resourcePicker({
      type: 'collection',
      action: 'select',
      multiple: true,
      selectionIds: initialSelectionIds
    });

    if (selections) {
      onChange(formatSelectionItems(selections));
    }
  };

  return (
    <>
      <TextField
        label={label}
        labelHidden
        placeholder="Search collections"
        prefix={<Icon source={SearchIcon} />}
        connectedRight={<Button onClick={handleOpenCollectionPicker}>Browse</Button>}
        onChange={handleOpenCollectionPicker}
      />
      <ResourceListWrapper>
        <ResourceList
          items={items}
          renderItem={({ title, imageUrl, shopifyCollectionId }, id, index) => (
            <CollectionResourceListItem
              key={index}
              title={title}
              imageUrl={imageUrl}
              shopifyCollectionId={shopifyCollectionId}
              onRemoveItem={onRemoveItem}
            />
          )}
        />
      </ResourceListWrapper>
    </>
  );
};

CollectionResourceList.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      handle: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      shopifyCollectionId: PropTypes.number.isRequired
    })
  ).isRequired,
  onChange: PropTypes.func,
  onRemoveItem: PropTypes.func
};

export default CollectionResourceList;
