import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ResourceList, TextField, Icon, Button } from '@shopify/polaris';
import { useAppBridge } from '@shopify/app-bridge-react';
import { SearchIcon } from '@shopify/polaris-icons';
import styled from 'styled-components';
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

const formatSelectionItems = (selections) => {
  return selections.map(({ id, title, handle, images, variants }) => ({
    title,
    handle,
    imageUrl: images?.[0]?.originalSrc,
    shopifyProductId: parseInt(id.split('/').reverse()[0]),
    shopifyVariantIds: variants.map((variant) => parseInt(variant.id.split('/').reverse()[0]))
  }));
};

const ProductResourceList = ({ label, items, onChange = () => {}, onRemoveItem = () => {} }) => {
  const shopify = useAppBridge();

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

  const handleOpenProductPicker = async () => {
    const selections = await shopify.resourcePicker({
      type: 'product',
      action: 'select',
      multiple: true,
      selectionIds: initialSelectionIds,
      filter: {
        draft: false,
        archived: false,
        variants: true
      }
    });

    if (selections) {
      onChange(formatSelectionItems(selections));
    }
  };

  const handleItemChange = (shopifyProductId, value) => {
    const formattedValue = formatSelectionItems(value);
    const productIndex = items.findIndex((item) => item.shopifyProductId === shopifyProductId);
    const filteredItems = items.filter((item) => item.shopifyProductId !== shopifyProductId);

    if (productIndex > -1) {
      onChange([...filteredItems.slice(0, productIndex), ...formattedValue, ...filteredItems.slice(productIndex)]);
    } else {
      onChange(filteredItems.concat(formattedValue));
    }
  };

  return (
    <>
      <TextField
        label={label}
        labelHidden
        placeholder="Search products"
        prefix={<Icon source={SearchIcon} />}
        connectedRight={<Button onClick={handleOpenProductPicker}>Browse</Button>}
        onChange={handleOpenProductPicker}
      />
      <ResourceListWrapper>
        <ResourceList
          items={items}
          renderItem={({ title, imageUrl, shopifyProductId, shopifyVariantIds }, id, index) => (
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
    </>
  );
};

ProductResourceList.propTypes = {
  label: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      handle: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      shopifyProductId: PropTypes.number.isRequired,
      shopifyVariantIds: PropTypes.array.isRequired
    })
  ).isRequired,
  onChange: PropTypes.func,
  onRemoveItem: PropTypes.func
};

export default ProductResourceList;
