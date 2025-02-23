import React from 'react';
import PropTypes from 'prop-types';
import { Thumbnail, ResourceItem, Button, Text, InlineStack, BlockStack } from '@shopify/polaris';
import { XCircleIcon } from '@shopify/polaris-icons';
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

const CollectionResourceListItem = ({ title, imageUrl, shopifyCollectionId, onRemoveItem = () => {} }) => {
  const handleRemoveItem = () => {
    onRemoveItem(shopifyCollectionId);
  };

  return (
    <ResourceItem name={title} media={<Thumbnail source={imageUrl} alt={title} size="small" />} verticalAlignment="center">
      <InlineStack align="space-between" wrap={false}>
        <BlockStack>
          <Text>{title}</Text>
        </BlockStack>
        <RemoveButtonWrapper>
          <Button variant="plain" icon={XCircleIcon} onClick={handleRemoveItem} />
        </RemoveButtonWrapper>
      </InlineStack>
    </ResourceItem>
  );
};

CollectionResourceListItem.propTypes = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  shopifyCollectionId: PropTypes.number.isRequired,
  onRemoveItem: PropTypes.func
};

export default CollectionResourceListItem;
