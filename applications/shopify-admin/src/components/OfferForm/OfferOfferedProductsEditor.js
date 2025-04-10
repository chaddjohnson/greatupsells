import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  FormLayout,
  BlockStack,
  Text,
  ChoiceList,
  Checkbox,
  TextField,
  Divider,
  Bleed,
  Box,
  InlineError
} from '@shopify/polaris';
import styled from 'styled-components';
import ProductResourceList from './ProductResourceList';
import CollectionResourceList from './CollectionResourceList';

const MaximumOfferedProductQuantityWrapper = styled.div`
  .Polaris-TextField {
    max-width: 170px;
  }
`;

const QuantityInputWrapper = styled.div`
  .Polaris-TextField {
    max-width: 170px;
  }
`;

const OfferOfferedProductsEditor = ({
  offer,
  theme,
  offeredProducts,
  offeredCollections,
  maximumOfferedProductQuantity,
  maximumAcceptedProductQuantity,
  submitted = false
}) => {
  const defaultAppliesTo = useMemo(() => {
    if (offeredCollections.value.length === 0 && offeredProducts.value.length === 0) {
      return 'INTELLIGENT';
    } else if (offeredCollections.value.length > 0) {
      return 'COLLECTIONS';
    } else {
      return 'PRODUCTS';
    }
  }, [offeredCollections.value, offeredProducts.value]);

  const [appliesTo, setAppliesTo] = useState(defaultAppliesTo);
  const [maximumAcceptedProductQuantityActive, setmaximumAcceptedProductQuantityActive] = useState(
    !!maximumAcceptedProductQuantity.value
  );

  const isCrossSellStrategy = ['CROSS_SELL', 'POST_PURCHASE', 'THANK_YOU_PAGE', 'ORDER_STATUS_PAGE'].includes(
    offer.strategy
  );

  const handleAppliesToChange = (value) => {
    setAppliesTo(value);

    if (value === 'INTELLIGENT') {
      offeredProducts.onChange([]);
      offeredCollections.onChange([]);
    }
    if (value === 'PRODUCTS') {
      offeredCollections.onChange([]);
    } else if (value === 'COLLECTIONS') {
      offeredProducts.onChange([]);
    }
  };

  const handleMaximumAcceptedProductQuantityActiveChange = (checked) => {
    setmaximumAcceptedProductQuantityActive(checked);

    if (!checked) {
      maximumAcceptedProductQuantity.onChange(undefined);
    }
  };

  const removeProduct = (shopifyProductId) => {
    offeredProducts.onChange(
      offeredProducts.value.filter((offeredProduct) => offeredProduct.shopifyProductId !== shopifyProductId)
    );
  };

  const removeCollection = (shopifyCollectionId) => {
    offeredCollections.onChange(
      offeredCollections.value.filter((triggerCollection) => triggerCollection.shopifyCollectionId !== shopifyCollectionId)
    );
  };

  useEffect(() => {
    if (offer.strategy.value === 'UPSELL' && !offeredProducts.value.length && !offeredCollections.value.length) {
      offeredProducts.setError('One or more offered products or collections are required');
    } else {
      offeredProducts.setError(undefined);
    }
  }, [offeredProducts.value, offeredCollections.value]); // eslint-disable-line react-hooks/exhaustive-deps

  if (offer.strategy === 'POPUP') {
    return null;
  }

  return (
    <Card>
      <BlockStack gap="400" padding="400">
        <Text variant="headingMd">Offered {isCrossSellStrategy ? 'products and collections' : 'products'}</Text>
        <FormLayout>
          {isCrossSellStrategy && (
            <ChoiceList
              title="Applies to"
              titleHidden
              choices={[
                offer.strategy !== 'UPSELL' && {
                  label: 'Intelligent',
                  value: 'INTELLIGENT',
                  helpText:
                    'Products will be offered intelligently based on past order history. Random products will be offered if there is insufficient history.'
                },
                {
                  label: 'Specific products',
                  value: 'PRODUCTS',
                  helpText: 'Only specific products selected below will be offered.'
                },
                {
                  label: 'Products from specific collections',
                  value: 'COLLECTIONS',
                  helpText: 'Only products from specific collections selected below will be offered.'
                }
              ].filter(Boolean)}
              selected={[appliesTo]}
              onChange={([value]) => handleAppliesToChange(value)}
            />
          )}
          {(offer.strategy === 'UPSELL' || appliesTo === 'PRODUCTS') && (
            <ProductResourceList
              label="Offered products"
              items={offeredProducts.value}
              onChange={offeredProducts.onChange}
              onRemoveItem={removeProduct}
            />
          )}
          {offer.strategy === 'CROSS_SELL' && appliesTo === 'COLLECTIONS' && (
            <CollectionResourceList
              label="Offered collections"
              items={offeredCollections.value}
              onChange={offeredCollections.onChange}
              onRemoveItem={removeCollection}
            />
          )}
          {submitted && offeredProducts.error && <InlineError message={offeredProducts.error} fieldID="offeredProducts" />}
          {isCrossSellStrategy && (
            <Bleed marginBlockEnd="400" marginInline="400">
              <Divider />
              <Box padding="400" paddingBlockEnd="500">
                <BlockStack gap="400">
                  <MaximumOfferedProductQuantityWrapper>
                    <TextField
                      label="Maximum offered products"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={theme.maximumOfferedProductQuantity}
                      helpText="Maximum number of products to offer. This is limited to what the selected theme supports."
                      {...maximumOfferedProductQuantity}
                      error={submitted && maximumOfferedProductQuantity.error}
                    />
                  </MaximumOfferedProductQuantityWrapper>
                  <Checkbox
                    label={`Set a maximum number of cross-sell items that may be accepted for this offer`}
                    helpText={
                      maximumAcceptedProductQuantityActive && (
                        <QuantityInputWrapper>
                          <TextField
                            type="number"
                            inputMode="numeric"
                            min={1}
                            helpText="Applies to total quantity of offered products."
                            {...maximumAcceptedProductQuantity}
                            error={submitted && maximumAcceptedProductQuantity.error}
                          />
                        </QuantityInputWrapper>
                      )
                    }
                    checked={maximumAcceptedProductQuantityActive}
                    onChange={handleMaximumAcceptedProductQuantityActiveChange}
                  />
                </BlockStack>
              </Box>
            </Bleed>
          )}
        </FormLayout>
      </BlockStack>
    </Card>
  );
};

OfferOfferedProductsEditor.propTypes = {
  offer: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  offeredProducts: PropTypes.object.isRequired,
  offeredCollections: PropTypes.object.isRequired,
  maximumOfferedProductQuantity: PropTypes.object.isRequired,
  maximumAcceptedProductQuantity: PropTypes.object.isRequired,
  submitted: PropTypes.bool
};

export default OfferOfferedProductsEditor;
