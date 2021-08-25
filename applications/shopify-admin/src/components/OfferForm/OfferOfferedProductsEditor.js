import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, FormLayout, ChoiceList, Checkbox } from '@shopify/polaris';
import ProductResourceList from './ProductResourceList';
import CollectionResourceList from './CollectionResourceList';

const OfferOfferedProductsEditor = ({
  offer,
  offeredProducts,
  offeredCollections
}) => {
  const [appliesTo, setAppliesTo] = useState(
    offeredCollections.value.length ? 'COLLECTIONS' : 'PRODUCTS'
  );

  const handleAppliesToChange = (value) => {
    setAppliesTo(value);

    if (value === 'PRODUCTS') {
      offeredCollections.onChange([]);
    } else if (value === 'COLLECTIONS') {
      offeredProducts.onChange([]);
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
          </FormLayout>
        </Card.Section>
        <Card.Section>
          <FormLayout>
            <Checkbox
              label={`Set a maximum number of ${
                offer.strategy === 'UPSELL' ? 'upsell' : 'cross-sell'
              } items per order`}
            />
          </FormLayout>
        </Card.Section>
      </Card>
    </>
  );
};

OfferOfferedProductsEditor.propTypes = {
  offer: PropTypes.object.isRequired,
  offeredProducts: PropTypes.object.isRequired,
  offeredCollections: PropTypes.object.isRequired
};

export default OfferOfferedProductsEditor;
