import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  FormLayout,
  TextField,
  ChoiceList,
  InlineError
} from '@shopify/polaris';
import styled from 'styled-components';
import { useCurrency } from '@greatupsells/react-hooks';
import ProductResourceList from './ProductResourceList';
import CollectionResourceList from './CollectionResourceList';

const MinimumRequiredAmountWrapper = styled.div`
  .Polaris-TextField {
    max-width: 170px;
  }
`;

const OfferTriggerProductsEditor = ({
  shop,
  offer,
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
  const { getCurrencySymbol } = useCurrency({
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

  useEffect(() => {
    if (offer.strategy === 'UPSELL') {
      setAppliesTo('PRODUCTS');
    }
  }, [offer.strategy]);

  useEffect(() => {
    if (offer.strategy !== 'UPSELL') {
      triggerProducts.setError(undefined);
      return;
    }

    if (!triggerProducts.value.length) {
      triggerProducts.setError('One or more trigger products are required');
    } else {
      triggerProducts.setError(undefined);
    }
  }, [triggerProducts.value, offer.strategy]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Card
        title={`Cart trigger products${
          offer.strategy === 'CROSS_SELL' ||
          offer.strategy === 'POST_PURCHASE' ||
          offer.strategy === 'THANK_YOU_PAGE'
            ? ' and collections'
            : ''
        }`}
      >
        <Card.Section>
          <FormLayout>
            {(offer.strategy === 'CROSS_SELL' ||
              offer.strategy === 'POST_PURCHASE' ||
              offer.strategy === 'THANK_YOU_PAGE') && (
              <ChoiceList
                title="Applies to"
                titleHidden
                choices={[
                  {
                    label: 'All products (including none)',
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
            )}
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
            {submitted && triggerProducts.error && (
              <InlineError
                message={triggerProducts.error}
                fieldID="triggerProducts"
              />
            )}
          </FormLayout>
        </Card.Section>
        <Card.Section title="Minimum cart requirements">
          <FormLayout>
            <ChoiceList
              choices={[
                {
                  label: 'None',
                  value: 'NONE'
                },
                {
                  label: `Minimum purchase amount (${currency})`,
                  value: 'AMOUNT',
                  renderChildren: (isSelected) =>
                    isSelected && (
                      <MinimumRequiredAmountWrapper>
                        <TextField
                          inputMode="numeric"
                          prefix={currencySymbol}
                          placeholder="0.00"
                          helpText="Amount before taxes and shipping."
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
  offer: PropTypes.object.isRequired,
  triggerProducts: PropTypes.object.isRequired,
  triggerCollections: PropTypes.object.isRequired,
  minimumRequirement: PropTypes.object.isRequired,
  minimumRequiredAmount: PropTypes.object.isRequired,
  submitted: PropTypes.bool
};

export default OfferTriggerProductsEditor;
