import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, FormLayout, TextField, Icon } from '@shopify/polaris';
import { SearchMinor } from '@shopify/polaris-icons';
import { ResourcePicker } from '@shopify/app-bridge-react';
import ProductResourceList from './ProductResourceList';

const OfferProductsEditor = ({
  offer,
  offeredProducts,
  offeredCollections
}) => {
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [collectionPickerOpen, setCollectionPickerOpen] = useState(false);

  return (
    (offer.strategy === 'UPSELL' || offer.strategy === 'CROSS_SELL') && (
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
              <TextField
                label="Offered products"
                helpText={`Up to three selected products will be shown at random and offered as ${
                  offer.strategy === 'UPSELL' ? 'upsell' : 'cross-sell'
                }s.`}
                placeholder="Search products"
                prefix={<Icon source={SearchMinor} />}
                connectedRight={
                  <Button onClick={() => setProductPickerOpen(true)}>
                    Browse
                  </Button>
                }
                onChange={() => setProductPickerOpen(true)}
              />
              <ProductResourceList
                items={offeredProducts}
                // onChange={}
                // onRemoveItem={offeredProducts => setOffer({ ...offer, offeredProducts })}
              />
              {offer.strategy === 'CROSS_SELL' && (
                <>
                  <TextField
                    label="Offered collections"
                    helpText={`Up to three products from selected collections will be shown at random and offered as ${
                      offer.strategy === 'UPSELL' ? 'upsell' : 'cross-sell'
                    }s.`}
                    placeholder="Search collections"
                    prefix={<Icon source={SearchMinor} />}
                    connectedRight={
                      <Button onClick={() => setCollectionPickerOpen(true)}>
                        Browse
                      </Button>
                    }
                    onChange={() => setCollectionPickerOpen(true)}
                  />
                  <ProductResourceList
                    items={offeredCollections}
                    // onChange={}
                    // onRemoveItem={offeredCollections => setOffer({ ...offer, offeredCollections })}
                  />
                </>
              )}
            </FormLayout>
          </Card.Section>
        </Card>
        {productPickerOpen && (
          <ResourcePicker
            resourceType="Product"
            showVariants={false}
            allowMultiple={true}
            open={productPickerOpen}
            onSelection={() => setProductPickerOpen(false)}
            onCancel={() => setProductPickerOpen(false)}
          />
        )}
        {collectionPickerOpen && (
          <ResourcePicker
            resourceType="Collection"
            allowMultiple={true}
            open={collectionPickerOpen}
            onSelection={() => setCollectionPickerOpen(false)}
            onCancel={() => setCollectionPickerOpen(false)}
          />
        )}
      </>
    )
  );
};

OfferProductsEditor.propTypes = {
  offer: PropTypes.object.isRequired,
  offeredProducts: PropTypes.arrayOf(PropTypes.object).isRequired,
  offeredCollections: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default OfferProductsEditor;
