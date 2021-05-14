import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, FormLayout, TextField, Icon } from '@shopify/polaris';
import { SearchMinor } from '@shopify/polaris-icons';
import { ResourcePicker } from '@shopify/app-bridge-react';
import ManagedResourceList from './ManagedResourceList';

const OfferProductsEditor = ({ offer }) => {
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [collectionPickerOpen, setCollectionPickerOpen] = useState(false);

  return (
    <>
      <Card
        title={`Offered ${
          offer.strategy === 'CROSS_SELL'
            ? 'products and collections'
            : 'products'
        }`}
        sectioned
      >
        <FormLayout>
          <TextField
            label="Offered products"
            helpText={`Selected products will be shown at random and offered as ${
              offer.strategy === 'UPSELL' ? 'upsell' : 'cross-sell'
            }s.`}
            placeholder="Search products"
            prefix={<Icon source={SearchMinor} />}
            connectedRight={
              <Button onClick={() => setProductPickerOpen(true)}>Browse</Button>
            }
            onChange={() => setProductPickerOpen(true)}
          />
          <ManagedResourceList
            items={offer.offeredProducts}
            // onChange={}
            // onRemoveItem={offeredProducts => setOffer({ ...offer, offeredProducts })}
          />
          {offer.strategy === 'CROSS_SELL' && (
            <>
              <TextField
                label="Offered collections"
                helpText={`Products from selected collections will be shown at random and offered as ${
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
              <ManagedResourceList
                items={offer.offeredCollections}
                // onChange={}
                // onRemoveItem={offeredCollections => setOffer({ ...offer, offeredCollections })}
              />
            </>
          )}
        </FormLayout>
      </Card>
      {productPickerOpen && (
        <ResourcePicker
          resourceType="Product"
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
  );
};

OfferProductsEditor.propTypes = {
  offer: PropTypes.object.isRequired
};

OfferProductsEditor.defaultProps = {
  //
};

export default OfferProductsEditor;
