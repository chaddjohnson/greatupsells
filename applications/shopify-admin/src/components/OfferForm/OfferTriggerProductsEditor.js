import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, FormLayout, TextField, ChoiceList } from '@shopify/polaris';
import styled from 'styled-components';
import { useNumberFormatter } from '@neatowebsolutions/upselling-react-hooks';
import ProductResourceList from './ProductResourceList';
import CollectionResourceList from './CollectionResourceList';

const MinimumRequiredAmountWrapper = styled.div`
  .Polaris-TextField {
    max-width: 150px;
  }
`;

const OfferTriggerProductsEditor = ({
  shop,
  triggerProducts,
  triggerCollections,
  minimumRequirement,
  minimumRequiredAmount,
  submitted
}) => {
  let initialAppliesTo = 'ALL';

  if (triggerProducts.value.length) {
    initialAppliesTo = 'PRODUCTS';
  } else if (triggerCollections.value.length) {
    initialAppliesTo = 'COLLECTIONS';
  }

  const [appliesTo, setAppliesTo] = useState(initialAppliesTo);

  const { locale, countryCode, currency } = shop || {};
  const { getCurrencySymbol } = useNumberFormatter({
    locale,
    countryCode,
    currency
  });
  const currencySymbol = getCurrencySymbol();

  const handleAppliesToChange = (value) => {
    setAppliesTo(value);

    if (value === 'ALL') {
      triggerProducts.onChange([]);
      triggerCollections.onChange([]);
    } else if (value === 'PRODUCTS') {
      triggerCollections.onChange([]);
    } else if (value === 'COLLECTIONS') {
      triggerProducts.onChange([]);
    }
  };

  const handleProductSelection = (value) => {
    triggerProducts.onChange(value);
  };

  const handleCollectionSelection = (value) => {
    triggerCollections.onChange(value);
  };

  const removeProduct = (shopifyProductId) => {
    triggerProducts.onChange(
      triggerProducts.value.filter(
        (offeredProduct) => offeredProduct.shopifyProductId !== shopifyProductId
      )
    );
  };

  const removeCollection = (shopifyCollectionId) => {
    triggerCollections.onChange(
      triggerCollections.value.filter(
        (triggerCollection) =>
          triggerCollection.shopifyCollectionId !== shopifyCollectionId
      )
    );
  };

  const handleMinimumRequirementChange = (value) => {
    minimumRequirement.onChange(value);
    minimumRequiredAmount.onChange(undefined);
  };

  return (
    <>
      <Card title="Trigger products and collections">
        <Card.Section>
          <FormLayout>
            <ChoiceList
              title="Applies to"
              titleHidden
              choices={[
                {
                  label: 'All products',
                  value: 'ALL'
                },
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
            {appliesTo === 'PRODUCTS' && (
              <>
                <ProductResourceList
                  label="Trigger products"
                  items={triggerProducts.value}
                  onChange={handleProductSelection}
                  onRemoveItem={removeProduct}
                />
              </>
            )}
            {appliesTo === 'COLLECTIONS' && (
              <>
                <CollectionResourceList
                  label="Trigger collections"
                  items={triggerCollections.value}
                  onChange={handleCollectionSelection}
                  onRemoveItem={removeCollection}
                />
              </>
            )}
          </FormLayout>
        </Card.Section>
        <Card.Section title="Minimum requirements">
          <FormLayout>
            <ChoiceList
              choices={[
                {
                  label: 'None',
                  value: 'NONE'
                },
                {
                  label: `Minimum purchase amount (${currencySymbol})`,
                  value: 'AMOUNT',
                  renderChildren: (isSelected) =>
                    isSelected && (
                      <MinimumRequiredAmountWrapper>
                        <TextField
                          inputMode="numeric"
                          prefix={currencySymbol}
                          placeholder="0.00"
                          helpText="Applies to trigger products."
                          {...minimumRequiredAmount}
                          error={submitted && minimumRequiredAmount.error}
                        />
                      </MinimumRequiredAmountWrapper>
                    )
                },
                {
                  label: 'Minimum quantity of items',
                  value: 'QUANTITY',
                  renderChildren: (isSelected) =>
                    isSelected && (
                      <MinimumRequiredAmountWrapper>
                        <TextField
                          inputMode="numeric"
                          helpText="Applies to trigger products."
                          {...minimumRequiredAmount}
                          error={submitted && minimumRequiredAmount.error}
                        />
                      </MinimumRequiredAmountWrapper>
                    )
                }
              ]}
              selected={[minimumRequirement.value]}
              onChange={([value]) => handleMinimumRequirementChange(value)}
            />
          </FormLayout>
        </Card.Section>
      </Card>
    </>
  );
};

OfferTriggerProductsEditor.propTypes = {
  shop: PropTypes.object.isRequired,
  triggerProducts: PropTypes.object.isRequired,
  triggerCollections: PropTypes.object.isRequired,
  minimumRequirement: PropTypes.object.isRequired,
  minimumRequiredAmount: PropTypes.object.isRequired,
  submitted: PropTypes.bool
};

export default OfferTriggerProductsEditor;
