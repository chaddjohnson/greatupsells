import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, FormLayout, TextField, ChoiceList, Banner, BlockStack, Text } from '@shopify/polaris';
import styled from 'styled-components';
import { useCurrency } from '@greatupsells/react-hooks';

const DiscountValueInputWrapper = styled.div`
  .Polaris-TextField {
    max-width: 170px;
  }
`;

const OfferDiscountEditor = ({ shop, offer, discountType, discountValue, discountTitle, submitted = false }) => {
  const [discountValueInternal, setDiscountValueInternal] = useState(
    discountType.value === 'PERCENTAGE' && discountValue.value ? discountValue.value * 100 : discountValue.value
  );
  const { locale, countryCode, currency } = shop || {};
  const { getCurrencySymbol } = useCurrency({
    locale,
    countryCode,
    currency
  });
  const currencySymbol = getCurrencySymbol();

  const handleDiscountTypeChange = (value) => {
    if (discountType.value === 'NO_DISCOUNT') {
      discountValue.onChange(undefined);
      discountTitle.onChange(undefined);
    }

    discountType.onChange(value);

    setDiscountValueInternal(undefined);
    discountValue.onChange(undefined);
  };

  const handleDiscountValueChange = (value) => {
    setDiscountValueInternal(value);

    discountValue.onChange(discountType.value === 'PERCENTAGE' && value ? value / 100 : value);
  };

  const handleDiscountValueBlur = () => {
    if (discountType.value === 'PERCENTAGE' || discountType.value === 'NO_DISCOUNT') {
      return discountValue.onBlur();
    }

    if (discountValueInternal) {
      setDiscountValueInternal(parseFloat(discountValueInternal)?.toFixed(2));
    }

    discountValue.onBlur();
  };

  if (offer.strategy === 'POPUP') {
    return null;
  }

  return (
    <Card>
      <BlockStack gap="400" padding="400">
        <Text variant="headingMd">Discount</Text>
        <FormLayout>
          <ChoiceList
            choices={[
              {
                label: 'Percentage off',
                value: 'PERCENTAGE'
              },
              {
                label: `${currency} off`,
                value: 'AMOUNT'
              },
              {
                label: 'Set price',
                value: 'SET_PRICE'
              },
              {
                label: 'No discount',
                value: 'NO_DISCOUNT'
              }
            ]}
            selected={discountType.value}
            onChange={([value]) => handleDiscountTypeChange(value)}
          />
          {discountType.value !== 'NO_DISCOUNT' && (
            <DiscountValueInputWrapper>
              <TextField
                label="Discount value"
                prefix={
                  (discountType.value === 'AMOUNT' && currencySymbol) ||
                  (discountType.value === 'SET_PRICE' && currencySymbol)
                }
                suffix={discountType.value === 'PERCENTAGE' && '%'}
                placeholder={
                  (discountType.value === 'AMOUNT' && '0.00') || (discountType.value === 'SET_PRICE' && '0.00') || undefined
                }
                helpText={
                  discountType.value !== 'SET_PRICE'
                    ? 'The discount amount applied to each offered item added to the cart. Discounts are applied during checkout.'
                    : 'The price for each offered item added to the cart. Discounts are applied during checkout.'
                }
                inputMode="numeric"
                {...discountValue}
                value={discountValueInternal?.toString()}
                error={submitted && discountValue.error}
                onChange={handleDiscountValueChange}
                onBlur={handleDiscountValueBlur}
              />
            </DiscountValueInputWrapper>
          )}
          {discountType.value !== 'NO_DISCOUNT' && (
            <TextField
              label="Discount description"
              placeholder={
                (discountType.value === 'PERCENTAGE' && '10% off') ||
                (discountType.value === 'AMOUNT' && '$10 off') ||
                (discountType.value === 'SET_PRICE' && 'Discounted price') ||
                undefined
              }
              helpText="This will show as a description for discounted order line items."
              {...discountTitle}
              error={submitted && discountTitle.error}
            />
          )}
          {discountType.value !== 'NO_DISCOUNT' && (
            <Banner title="Can't combine with discounts" tone="info">
              Customers won&apos;t be able to enter a discount code or use an automatic discount if this offer is accepted.
            </Banner>
          )}
        </FormLayout>
      </BlockStack>
    </Card>
  );
};

OfferDiscountEditor.propTypes = {
  shop: PropTypes.object.isRequired,
  offer: PropTypes.object.isRequired,
  discountType: PropTypes.object.isRequired,
  discountValue: PropTypes.object.isRequired,
  discountTitle: PropTypes.object.isRequired,
  submitted: PropTypes.bool
};

export default OfferDiscountEditor;
