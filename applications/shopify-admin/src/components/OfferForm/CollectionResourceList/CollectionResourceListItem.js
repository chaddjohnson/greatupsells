import React from 'react';
import PropTypes from 'prop-types';
import {
  Thumbnail,
  ResourceItem,
  Button,
  TextContainer,
  Stack
} from '@shopify/polaris';
import { CancelSmallMinor } from '@shopify/polaris-icons';
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

const CollectionResourceListItem = ({
  title,
  imageUrl,
  shopifyCollectionId,
  onRemoveItem
}) => {
  const handleRemoveItem = () => {
    onRemoveItem(shopifyCollectionId);
  };

  return (
    <ResourceItem
      name={title}
      media={<Thumbnail source={imageUrl} alt={title} size="small" />}
      verticalAlignment="center"
    >
      <Stack distribution="equalSpacing" wrap={false}>
        <Stack.Item fill>
          <Stack.Item>
            <TextContainer>{title}</TextContainer>
          </Stack.Item>
        </Stack.Item>
        <RemoveButtonWrapper>
          <Button icon={CancelSmallMinor} plain onClick={handleRemoveItem} />
        </RemoveButtonWrapper>
      </Stack>
    </ResourceItem>
  );
};

CollectionResourceListItem.propTypes = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  shopifyCollectionId: PropTypes.number.isRequired,
  onRemoveItem: PropTypes.func
};

CollectionResourceListItem.defaultProps = {
  onRemoveItem: () => {}
};

export default CollectionResourceListItem;
