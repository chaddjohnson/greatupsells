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
  submitted
}) => {
  const [appliesTo, setAppliesTo] = useState(
    offeredCollections.value.length ? 'COLLECTIONS' : 'PRODUCTS'
  );
  const [
    maximumAcceptedProductQuantityActive,
    setmaximumAcceptedProductQuantityActive
  ] = useState(!!maximumAcceptedProductQuantity.value);

  const isCrossSellStrategy = [
    'CROSS_SELL',
    'POST_PURCHASE',
    'THANK_YOU_PAGE',
    'ORDER_STATUS_PAGE'
  ].includes(offer.strategy);

  const handleAppliesToChange = (value) => {
    setAppliesTo(value);

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

  if (offer.strategy === 'POPUP') {
    return null;
  }

  return (
    <>
      <Card
        title={`Offered ${
          isCrossSellStrategy ? 'products and collections' : 'products'
        }`}
      >
        <Card.Section>
          <FormLayout>
            {isCrossSellStrategy && (
              <ChoiceList
                title="Applies to"
                titleHidden
                choices={[
                  {
                    label: 'Specific products',
                    value: 'PRODUCTS'
                  },
                  {
                    label: 'Specific collections',
                    value: 'COLLECTIONS'
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
            {submitted && offeredProducts.error && (
              <InlineError
                message={offeredProducts.error}
                fieldID="offeredProducts"
              />
            )}
          </FormLayout>
        </Card.Section>
        {isCrossSellStrategy && (
          <Card.Section>
            <FormLayout>
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
                        inputMode="numeric"
                        min={1}
                        helpText="Applies to offered products."
                        {...maximumAcceptedProductQuantity}
                        error={
                          submitted && maximumAcceptedProductQuantity.error
                        }
                      />
                    </QuantityInputWrapper>
                  )
                }
                checked={maximumAcceptedProductQuantityActive}
                onChange={handleMaximumAcceptedProductQuantityActiveChange}
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
  theme: PropTypes.object.isRequired,
  offeredProducts: PropTypes.object.isRequired,
  offeredCollections: PropTypes.object.isRequired,
  maximumOfferedProductQuantity: PropTypes.object.isRequired,
  maximumAcceptedProductQuantity: PropTypes.object.isRequired,
  submitted: PropTypes.bool
};

OfferOfferedProductsEditor.defaultProps = {
  submitted: false
};

export default OfferOfferedProductsEditor;
