import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, TextField, Icon, Banner } from '@shopify/polaris';
import { SearchMinor } from '@shopify/polaris-icons';
import { ResourcePicker } from '@shopify/app-bridge-react';
import ManagedResourceList from './ManagedResourceList';

const OfferTriggersEditor = ({ offer }) => {
  const [triggerProductPickerOpen, setTriggerProductPickerOpen] = useState(
    false
  );
  const [
    triggerCollectionPickerOpen,
    setTriggerCollectionPickerOpen
  ] = useState(false);

  return (
    <>
      {['ADD', 'CART'].indexOf(offer.triggerEvent) > -1 && (
        <Card title="Triggers">
          {offer.triggerEvent === 'ADD' &&
            !offer.triggerProducts.value?.length &&
            !offer.triggerProducts?.length && (
              <Card.Section>
                <Banner status="warning">
                  Offer will show regardless of products added to Cart.
                </Banner>
              </Card.Section>
            )}
          {offer.triggerEvent === 'CART' &&
            !offer.triggerProducts.value?.length &&
            !offer.triggerProducts?.length && (
              <Card.Section>
                <Banner status="warning">
                  Offer will show regardless of products in Cart.
                </Banner>
              </Card.Section>
            )}{' '}
          <Card.Section title="Products">
            <TextField
              helpText="The popup will show when any selected products are in the cart."
              placeholder="Search products"
              prefix={<Icon source={SearchMinor} />}
              connectedRight={
                <Button onClick={() => setTriggerProductPickerOpen(true)}>
                  Browse
                </Button>
              }
              onChange={() => setTriggerProductPickerOpen(true)}
            />
            <ManagedResourceList
              items={offer.triggerProducts}
              // onChange={triggerProducts.onChange}
              // onRemoveItem={triggerProducts => setOffer({ ...offer, triggerProducts })}
            />
          </Card.Section>
          <Card.Section title="Collections">
            <TextField
              helpText="The popup will show when products from selected collections are in the cart."
              placeholder="Search collections"
              prefix={<Icon source={SearchMinor} />}
              connectedRight={
                <Button onClick={() => setTriggerCollectionPickerOpen(true)}>
                  Browse
                </Button>
              }
              onChange={() => setTriggerCollectionPickerOpen(true)}
            />
            <ManagedResourceList
              items={offer.triggerCollections}
              // onChange={triggerCollections.onChange}
              // onRemoveItem={triggerCollections => setOffer({ ...offer, triggerCollections })}
            />
          </Card.Section>
        </Card>
      )}
      {triggerProductPickerOpen && (
        <ResourcePicker
          resourceType="Product"
          allowMultiple={true}
          open={triggerProductPickerOpen}
          onSelection={() => setTriggerProductPickerOpen(false)}
          onCancel={() => setTriggerProductPickerOpen(false)}
        />
      )}
      {triggerCollectionPickerOpen && (
        <ResourcePicker
          resourceType="Collection"
          allowMultiple={true}
          open={triggerCollectionPickerOpen}
          onSelection={() => setTriggerCollectionPickerOpen(false)}
          onCancel={() => setTriggerCollectionPickerOpen(false)}
        />
      )}
    </>
  );
};

OfferTriggersEditor.propTypes = {
  offer: PropTypes.object.isRequired
};

export default OfferTriggersEditor;
