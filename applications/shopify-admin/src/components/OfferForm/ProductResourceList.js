import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  ResourceList,
  Thumbnail,
  ResourceItem,
  Button,
  Checkbox,
  TextField,
  Stack
} from '@shopify/polaris';
import { CancelSmallMinor } from '@shopify/polaris-icons';
import styled from 'styled-components';

const ResourceListWrapper = styled.div`
  cursor: default;

  .Polaris-ResourceItem {
    cursor: default;
  }

  .Polaris-ResourceItem__Container {
    padding-left: 2rem;
  }
`;

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

const QuantityInputWrapper = styled.div`
  .Polaris-Connected {
    flex-wrap: wrap;
    align-items: center;
  }
  .Polaris-TextField {
    max-width: 170px;
  }
`;

const ProductResourceList = ({ items, onChange, onRemoveItem }) => {
  const [minQuantitiesChecked, setMinQuantitiesChecked] = useState(
    items.map(({ minQuantity }) => !!minQuantity?.value)
  );
  const [maxQuantitiesChecked, setMaxQuantitiesChecked] = useState(
    items.map(({ maxQuantity }) => !!maxQuantity?.value)
  );

  const handleChange = () => {
    //
  };

  const handleMinQuantityChecked = (index, checked) => {
    setMinQuantitiesChecked(
      minQuantitiesChecked.map((current, currentIndex) =>
        currentIndex === index ? checked : current
      )
    );

    if (checked) {
      items[index].minQuantity?.onChange('1');
    }
    if (!checked) {
      items[index].minQuantity?.onChange(undefined);
    }
  };

  const handleMaxQuantityChecked = (index, checked) => {
    setMaxQuantitiesChecked(
      maxQuantitiesChecked.map((current, currentIndex) =>
        currentIndex === index ? checked : current
      )
    );

    if (checked) {
      items[index].maxQuantity?.onChange('1');
    }
    if (!checked) {
      items[index].maxQuantity?.onChange(undefined);
    }
  };

  const removeItem = (index) => [
    ...items.slice(0, index),
    ...items.slice(index + 1)
  ];

  return (
    <ResourceListWrapper>
      <ResourceList
        items={items}
        onSelectionChange={handleChange}
        renderItem={(
          { title, imageUrl, minQuantity, maxQuantity },
          id,
          index
        ) => (
          <ResourceItem
            name={title.value}
            media={
              <Thumbnail
                source={imageUrl.value}
                alt={title.value}
                size="small"
              />
            }
          >
            <Stack distribution="equalSpacing" wrap={false}>
              <Stack.Item fill>
                <Stack spacing="tight" vertical>
                  <Stack.Item>{title.value}</Stack.Item>
                  <Stack spacing="extraTight" vertical>
                    <Checkbox
                      label="Minimum quantity"
                      checked={minQuantitiesChecked[index]}
                      helpText={
                        minQuantitiesChecked[index] && (
                          <QuantityInputWrapper>
                            <TextField
                              type="number"
                              inputMode="numeric"
                              min={0}
                              step={1}
                              suffix="items"
                              {...minQuantity}
                            />
                          </QuantityInputWrapper>
                        )
                      }
                      onChange={(checked) =>
                        handleMinQuantityChecked(index, checked)
                      }
                    />
                    <Checkbox
                      label="Maximum quantity"
                      checked={maxQuantitiesChecked[index]}
                      helpText={
                        maxQuantitiesChecked[index] && (
                          <QuantityInputWrapper>
                            <TextField
                              type="number"
                              inputMode="numeric"
                              min={1}
                              step={1}
                              suffix="items"
                              {...maxQuantity}
                            />
                          </QuantityInputWrapper>
                        )
                      }
                      onChange={(checked) =>
                        handleMaxQuantityChecked(index, checked)
                      }
                    />
                  </Stack>
                </Stack>
              </Stack.Item>
              <RemoveButtonWrapper>
                <Button
                  icon={CancelSmallMinor}
                  plain
                  onClick={() => onRemoveItem(removeItem(index, items))}
                />
              </RemoveButtonWrapper>
            </Stack>
          </ResourceItem>
        )}
      />
    </ResourceListWrapper>
  );
};

ProductResourceList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.object.isRequired,
      imageUrl: PropTypes.object.isRequired,
      minQuantity: PropTypes.object,
      maxQuantity: PropTypes.object
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
