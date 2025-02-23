import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Thumbnail, ResourceItem, Button, BlockStack, InlineStack, Text } from '@shopify/polaris';
import { XCircleIcon } from '@shopify/polaris-icons';
import { useAppBridge } from '@shopify/app-bridge-react';

const ProductResourceListItem = ({
  title,
  imageUrl,
  shopifyProductId,
  shopifyVariantIds,
  onChange = () => {},
  onRemoveItem = () => {}
}) => {
  const shopify = useAppBridge();

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

  const handleShowProductPicker = async () => {
    const selected = await shopify.resourcePicker({
      type: 'product',
      action: 'select',
      multiple: true,
      query: `id:${shopifyProductId}`,
      selectionIds: initialSelectionIds,
      filter: {
        draft: false,
        archived: false,
        variants: true
      }
    });

    if (selected) {
      onChange(shopifyProductId, selected);
    }
  };

  const handleRemoveItem = () => {
    onRemoveItem(shopifyProductId);
  };

  return (
    <ResourceItem name={title} media={<Thumbnail source={imageUrl} alt={title} size="small" transparent={true} />}>
      <InlineStack align="space-between" wrap={false}>
        <BlockStack>
          <Text>{title}</Text>
          <Text tone="subdued">
            ({shopifyVariantIds.length} {shopifyVariantIds.length === 1 ? 'variant' : 'variants'} selected)
          </Text>
        </BlockStack>
        <InlineStack gap="200">
          <Button variant="plain" onClick={handleShowProductPicker}>
            Edit
          </Button>
          <Button variant="plain" icon={XCircleIcon} onClick={handleRemoveItem} />
        </InlineStack>
      </InlineStack>
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

export default ProductResourceListItem;
