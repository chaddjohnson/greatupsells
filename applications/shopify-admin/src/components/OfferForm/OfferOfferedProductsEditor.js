import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  FormLayout,
  ChoiceList,
  Checkbox,
  TextField,
  InlineError
} from '@shopify/polaris';
import styled from 'styled-components';
import ProductResourceList from './ProductResourceList';
import CollectionResourceList from './CollectionResourceList';

const QuantityInputWrapper = styled.div`
  .Polaris-TextField {
    max-width: 170px;
  }
`;

const OfferOfferedProductsEditor = ({
  offer,
  offeredProducts,
  offeredCollections,
  maximumOfferedProductQuantity,
  submitted
}) => {
  const [appliesTo, setAppliesTo] = useState(
    offeredCollections.value.length ? 'COLLECTIONS' : 'PRODUCTS'
  );
  const [
    maximumOfferedProductQuantityActive,
    setMaximumOfferedProductQuantityActive
  ] = useState(!!maximumOfferedProductQuantity.value);

  const handleAppliesToChange = (value) => {
    setAppliesTo(value);

    if (value === 'PRODUCTS') {
      offeredCollections.onChange([]);
    } else if (value === 'COLLECTIONS') {
      offeredProducts.onChange([]);
    }
  };

  const handleMaximumOfferedProductQuantityActiveChange = (checked) => {
    setMaximumOfferedProductQuantityActive(checked);

    if (!checked) {
      maximumOfferedProductQuantity.onChange(undefined);
    }
  };

  const handleProductSelection = (value) => {
    offeredProducts.onChange(value);
  };

  const handleCollectionSelection = (value) => {
    offeredCollections.onChange(value);
  };

  const removeProduct = (shopifyProductId) => {
    offeredProducts.onChange(
      offeredProducts.value.filter(
        (offeredProduct) => offeredProduct.shopifyProductId !== shopifyProductId
      )
    );
  };

  const removeCollection = (shopifyCollectionId) => {
    offeredCollections.onChange(
      offeredCollections.value.filter(
        (triggerCollection) =>
          triggerCollection.shopifyCollectionId !== shopifyCollectionId
      )
    );
  };

  useEffect(() => {
    if (!offeredProducts.value.length && !offeredCollections.value.length) {
      offeredProducts.setError(
        'One or more offered products or collections are required'
      );
    } else {
      offeredProducts.setError(undefined);
    }
  }, [offeredProducts.value, offeredCollections.value]); // eslint-disable-line react-hooks/exhaustive-deps

  if (offer.strategy !== 'UPSELL' && offer.strategy !== 'CROSS_SELL') {
    return null;
  }

  return (
    <>
      <Card
        title={`Offered ${
          offer.strategy === 'CROSS_SELL'
            ? 'products and collections'
            : 'products'
        }`}
      >
        <Card.Section>
          <FormLayout>
            {offer.strategy === 'CROSS_SELL' && (
              <ChoiceList
                title="Applies to"
                titleHidden
                choices={[
                  {
                    label: 'Specific products',
                    value: 'PRODUCTS'
                    // helpText: `Up to three selected products will be shown at random and offered as ${offer.strategy === 'UPSELL' ? 'upsell' : 'cross-sell'}s.`
                  },
                  {
                    label: 'Specific collections',
                    value: 'COLLECTIONS'
                    // helpText: `Up to three products from selected collections will be shown at random and offered as ${offer.strategy === 'UPSELL' ? 'upsell' : 'cross-sell'}s.`
                  }
                ]}
                selected={[appliesTo]}
                onChange={([value]) => handleAppliesToChange(value)}
              />
            )}
            {(offer.strategy === 'UPSELL' || appliesTo === 'PRODUCTS') && (
              <ProductResourceList
                label="Offered products"
                items={offeredProducts.value}
                onChange={handleProductSelection}
                onRemoveItem={removeProduct}
              />
            )}
            {offer.strategy === 'CROSS_SELL' && appliesTo === 'COLLECTIONS' && (
              <CollectionResourceList
                label="Offered collections"
                items={offeredCollections.value}
                onChange={handleCollectionSelection}
                onRemoveItem={removeCollection}
              />
            )}
            {submitted && offeredProducts.error && (
              <InlineError
                message={offeredProducts.error}
                fieldID="offeredProducts"
              />
            )}
          </FormLayout>
        </Card.Section>
        {offer.strategy === 'CROSS_SELL' && (
          <Card.Section>
            <FormLayout>
              <Checkbox
                label={`Set a maximum number of cross-sell items for this offer`}
                helpText={
                  maximumOfferedProductQuantityActive && (
                    <QuantityInputWrapper>
                      <TextField
                        inputMode="numeric"
                        min={1}
                        helpText="Applies to offered products."
                        {...maximumOfferedProductQuantity}
                        error={submitted && maximumOfferedProductQuantity.error}
                      />
                    </QuantityInputWrapper>
                  )
                }
                checked={maximumOfferedProductQuantityActive}
                onChange={handleMaximumOfferedProductQuantityActiveChange}
              />
            </FormLayout>
          </Card.Section>
        )}
      </Card>
    </>
  );
};

OfferOfferedProductsEditor.propTypes = {
  offer: PropTypes.object.isRequired,
  offeredProducts: PropTypes.object.isRequired,
  offeredCollections: PropTypes.object.isRequired,
  maximumOfferedProductQuantity: PropTypes.object.isRequired,
  submitted: PropTypes.bool
};

OfferOfferedProductsEditor.defaultProps = {
  submitted: false
};

export default OfferOfferedProductsEditor;
