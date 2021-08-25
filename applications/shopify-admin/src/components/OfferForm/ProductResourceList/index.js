import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ResourceList, TextField, Icon, Button } from '@shopify/polaris';
import { ResourcePicker } from '@shopify/app-bridge-react';
import { SearchMinor } from '@shopify/polaris-icons';
import styled from 'styled-components';
import { flatten } from 'lodash';
import ProductResourceListItem from './ProductResourceListItem';

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

const formatSelectionItems = (value) => {
  return flatten(
    value.selection.map(({ id, title, images, variants }) => ({
      title,
      imageUrl: images?.[0]?.originalSrc,
      shopifyProductId: parseInt(id.split('/').reverse()[0]),
      shopifyVariantIds: variants.map((variant) =>
        parseInt(variant.id.split('/').reverse()[0])
      )
    }))
  );
};

const ProductResourceList = ({ label, items, onChange, onRemoveItem }) => {
  const [productPickerOpen, setProductPickerOpen] = useState(false);

  const handleOpenProductPicker = () => {
    setProductPickerOpen(true);
  };

  const handleCloseProductPicker = () => {
    setProductPickerOpen(false);
  };

  const handleChange = (value) => {
    const formattedValue = formatSelectionItems(value);

    onChange(formattedValue);
    setProductPickerOpen(false);
  };

  const handleItemChange = (shopifyProductId, value) => {
    const formattedValue = formatSelectionItems(value);
    const productIndex = items.findIndex(
      (item) => item.shopifyProductId === shopifyProductId
    );
    const filteredItems = items.filter(
      (item) => item.shopifyProductId !== shopifyProductId
    );

    if (productIndex > -1) {
      onChange([
        ...filteredItems.slice(0, productIndex),
        ...formattedValue,
        ...filteredItems.slice(productIndex)
      ]);
    } else {
      onChange(filteredItems.concat(formattedValue));
    }
  };

  const initialSelectionIds = useMemo(
    () =>
      items.map(({ shopifyProductId, shopifyVariantIds }) => ({
        id: `gid://shopify/Product/${shopifyProductId}`,
        variants: shopifyVariantIds.map((shopifyVariantId) => ({
          id: `gid://shopify/ProductVariant/${shopifyVariantId}`
        }))
      })),
    [items]
  );

  return (
    <>
      <TextField
        label={label}
        labelHidden
        placeholder="Search products"
        prefix={<Icon source={SearchMinor} />}
        connectedRight={
          <Button onClick={handleOpenProductPicker}>Browse</Button>
        }
        onChange={handleOpenProductPicker}
      />
      <ResourceListWrapper>
        <ResourceList
          items={items}
          renderItem={(
            { title, imageUrl, shopifyProductId, shopifyVariantIds },
            id,
            index
          ) => (
            <ProductResourceListItem
              key={index}
              title={title}
              imageUrl={imageUrl}
              shopifyProductId={shopifyProductId}
              shopifyVariantIds={shopifyVariantIds}
              onChange={handleItemChange}
              onRemoveItem={onRemoveItem}
            />
          )}
        />
      </ResourceListWrapper>
      <ResourcePicker
        resourceType="Product"
        actionVerb="select"
        showVariants={true}
        showArchived={false}
        showDraft={false}
        allowMultiple={true}
        open={productPickerOpen}
        initialSelectionIds={initialSelectionIds}
        onSelection={handleChange}
        onCancel={handleCloseProductPicker}
      />
    </>
  );
};

ProductResourceList.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      shopifyProductId: PropTypes.number.isRequired,
      shopifyVariantIds: PropTypes.array.isRequired
    })
  ).isRequired,
  onChange: PropTypes.func,
  onRemoveItem: PropTypes.func
};

ProductResourceList.defaultProps = {
  onChange: () => {},
  onRemoveItem: () => {}
};

export default ProductResourceList;
