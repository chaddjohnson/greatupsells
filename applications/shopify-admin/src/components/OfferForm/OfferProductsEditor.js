import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Button,
  FormLayout,
  TextField,
  Checkbox,
  ChoiceList,
  Icon
} from '@shopify/polaris';
import { SearchMinor } from '@shopify/polaris-icons';
import { ResourcePicker } from '@shopify/app-bridge-react';
import { asChoiceField } from '@shopify/react-form';
import ProductResourceList from './ProductResourceList';

const OfferProductsEditor = ({
  offer,
  offeredProducts,
  offeredCollections,
  hideOutOfStockProducts,
  enableBundling,
  enableVariantSelection,
  enableQuantitySelection
}) => {
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
        {offer.strategy === 'CROSS_SELL' && (
          <Card.Section title="Bundling">
            <FormLayout>
              <ChoiceList
                choices={[
                  {
                    label: 'Offer products individually',
                    helpText:
                      'Products will not be bundled and may be added to the cart individually.',
                    value: 'false'
                  },
                  {
                    label: 'Offer products in a bundle',
                    helpText:
                      'All products presented in the offer will be bundled and added to the cart together on acceptance. Bundling helps increase average order value.',
                    value: 'true'
                  }
                ]}
                selected={enableBundling.value.toString()}
                onChange={([value]) =>
                  enableBundling.onChange(value === 'true')
                }
              />
            </FormLayout>
          </Card.Section>
        )}
        <Card.Section title="Options">
          <FormLayout>
            <Checkbox
              label="Allow customers to select variants"
              helpText="Customers may select variants if available and if supported by the theme."
              {...asChoiceField(enableVariantSelection)}
            />
            <Checkbox
              label="Allow customers to change quantities"
              helpText="Customers may change quantities for products if supported by the theme."
              {...asChoiceField(enableQuantitySelection)}
            />
            <Checkbox
              label="Exclude out of stock products"
              {...asChoiceField(hideOutOfStockProducts)}
            />
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
  );
};

OfferProductsEditor.propTypes = {
  offer: PropTypes.object.isRequired,
  offeredProducts: PropTypes.arrayOf(PropTypes.object).isRequired,
  offeredCollections: PropTypes.arrayOf(PropTypes.object).isRequired,
  hideOutOfStockProducts: PropTypes.object.isRequired,
  enableBundling: PropTypes.object.isRequired,
  enableVariantSelection: PropTypes.object.isRequired,
  enableQuantitySelection: PropTypes.object.isRequired
};

export default OfferProductsEditor;
