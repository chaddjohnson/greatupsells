import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  FormLayout,
  TextField,
  Button,
  Icon,
  Banner
} from '@shopify/polaris';
import { SearchMinor } from '@shopify/polaris-icons';
import { ResourcePicker } from '@shopify/app-bridge-react';
import ProductResourceList from './ProductResourceList';

const OfferTriggerProductsEditor = ({
  offer,
  triggerProducts,
  triggerCollections
}) => {
  const [triggerProductPickerOpen, setTriggerProductPickerOpen] = useState(
    false
  );
  const [
    triggerCollectionPickerOpen,
    setTriggerCollectionPickerOpen
  ] = useState(false);

  return (
    <>
      <Card title="Triggers products and collections" sectioned>
        <FormLayout>
          {offer.triggerEvent === 'ADD' &&
            !offer.triggerProducts?.length &&
            !offer.triggerCollections?.length && (
              <Banner status="info">
                Offer will show when <em>any</em> product is added to the cart.
                Select triggers below to only show the offer when specific
                products or products in collections are added.
              </Banner>
            )}
          {offer.triggerEvent !== 'ADD' &&
            !offer.triggerProducts?.length &&
            !offer.triggerCollections?.length && (
              <Banner status="info">
                Offer will show regardless of products in the cart. Select
                triggers below to only show the offer when specific products or
                products in collections have been added to the cart.
              </Banner>
            )}
          {(!!offer.triggerProducts?.length ||
            !!offer.triggerCollections?.length) && (
            <Banner status="info">
              Offer will show only when a product or product in a collection
              below has been added to the cart.
            </Banner>
          )}
          <TextField
            label="Trigger products"
            helpText="The popup will show when any selected products have been added to the cart."
            placeholder="Search products"
            prefix={<Icon source={SearchMinor} />}
            connectedRight={
              <Button onClick={() => setTriggerProductPickerOpen(true)}>
                Browse
              </Button>
            }
            onChange={() => setTriggerProductPickerOpen(true)}
          />
          <ProductResourceList
            items={triggerProducts}
            // onChange={triggerProducts.onChange}
            // onRemoveItem={triggerProducts => setOffer({ ...offer, triggerProducts })}
          />
          <TextField
            label="Trigger collections"
            helpText="The popup will show when any products from selected collections have been added to the cart."
            placeholder="Search collections"
            prefix={<Icon source={SearchMinor} />}
            connectedRight={
              <Button onClick={() => setTriggerCollectionPickerOpen(true)}>
                Browse
              </Button>
            }
            onChange={() => setTriggerCollectionPickerOpen(true)}
          />
          <ProductResourceList
            items={triggerCollections}
            // onChange={triggerCollections.onChange}
            // onRemoveItem={triggerCollections => setOffer({ ...offer, triggerCollections })}
          />
        </FormLayout>
      </Card>
      {triggerProductPickerOpen && (
        <ResourcePicker
          resourceType="Product"
          showVariants={false}
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

OfferTriggerProductsEditor.propTypes = {
  offer: PropTypes.object.isRequired,
  triggerProducts: PropTypes.arrayOf(PropTypes.object).isRequired,
  triggerCollections: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default OfferTriggerProductsEditor;
