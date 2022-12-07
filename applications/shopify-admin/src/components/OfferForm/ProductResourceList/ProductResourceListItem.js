import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Thumbnail,
  ResourceItem,
  Button,
  TextContainer,
  Text,
  Stack
} from '@shopify/polaris';
import { CancelSmallMinor } from '@shopify/polaris-icons';
import { ResourcePicker } from '@shopify/app-bridge-react';
import styled from 'styled-components';

const RemoveButtonWrapper = styled.span`
  svg {
    fill: #5c5f62;
  }

  .Polaris-ResourceItem__ListItem:hover {
    svg {
      fill: #1a1c1d;
    }
  }
`;

const ProductResourceListItem = ({
  title,
  imageUrl,
  shopifyProductId,
  shopifyVariantIds,
  onChange,
  onRemoveItem
}) => {
  const [productPickerOpen, setProductPickerOpen] = useState(false);

  const handleShowProductPicker = () => {
    setProductPickerOpen(true);
  };

  const handleCloseProductPicker = () => {
    setProductPickerOpen(false);
  };

  const handleChange = (value) => {
    onChange(shopifyProductId, value);
    setProductPickerOpen(false);
  };

  const handleRemoveItem = () => {
    onRemoveItem(shopifyProductId);
  };

  const initialSelectionIds = useMemo(
    () => [
      {
        id: `gid://shopify/Product/${shopifyProductId}`,
        variants: shopifyVariantIds.map((shopifyVariantId) => ({
          id: `gid://shopify/ProductVariant/${shopifyVariantId}`
        }))
      }
    ],
    [shopifyProductId, shopifyVariantIds]
  );

  return (
    <ResourceItem
      name={title}
      media={<Thumbnail source={imageUrl} alt={title} size="small" />}
    >
      <Stack distribution="equalSpacing" wrap={false}>
        <Stack.Item fill>
          <Stack.Item>
            <TextContainer>{title}</TextContainer>
            <Text color="subdued">
              ({shopifyVariantIds.length}{' '}
              {shopifyVariantIds.length === 1 ? 'variant' : 'variants'}{' '}
              selected)
            </Text>
          </Stack.Item>
        </Stack.Item>
        <Stack>
          <Button plain onClick={handleShowProductPicker}>
            Edit
          </Button>
          <RemoveButtonWrapper>
            <Button icon={CancelSmallMinor} plain onClick={handleRemoveItem} />
          </RemoveButtonWrapper>
        </Stack>
      </Stack>
      {productPickerOpen && (
        <ResourcePicker
          resourceType="Product"
          actionVerb="select"
          showVariants={true}
          showArchived={false}
          showDraft={false}
          allowMultiple={true}
          open={productPickerOpen}
          initialQuery={`id:${shopifyProductId}`}
          initialSelectionIds={initialSelectionIds}
          onSelection={handleChange}
          onCancel={handleCloseProductPicker}
        />
      )}
    </ResourceItem>
  );
};

ProductResourceListItem.propTypes = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  shopifyProductId: PropTypes.number.isRequired,
  shopifyVariantIds: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  onRemoveItem: PropTypes.func
};

ProductResourceListItem.defaultProps = {
  onChange: () => {},
  onRemoveItem: () => {}
};

export default ProductResourceListItem;
