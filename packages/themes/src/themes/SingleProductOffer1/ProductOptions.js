import React, { useContext } from 'react';
import styled from '@greatupsells/styled-with-facepaint';
import { StateContext } from '../../components';

const VariantSelect = styled.select({
  border: '1px solid rgba(0, 0, 0, 0.2)',
  padding: '0.5rem',
  borderRadius: '2px',
  fontFamily: ({ theme }) => theme.bodyFont,
  fontSize: '14px',
  width: ['150px', '175px', '175px', '175px'],
  height: '36px',
  background:
    "url('data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0Ljk1IDEwIj48ZGVmcz48c3R5bGU+LmNscy0ye2ZpbGw6IzQ0NDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmFycm93czwvdGl0bGU+PHBvbHlnb24gY2xhc3M9ImNscy0yIiBwb2ludHM9IjEuNDEgNC42NyAyLjQ4IDMuMTggMy41NCA0LjY3IDEuNDEgNC42NyIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIzLjU0IDUuMzMgMi40OCA2LjgyIDEuNDEgNS4zMyAzLjU0IDUuMzMiLz48L3N2Zz4=') no-repeat right 2px center",
  MozAppearance: 'none',
  WebkitAppearance: 'none',
  appearance: 'none'
});

const QuantityInput = styled.input({
  border: '1px solid rgba(0, 0, 0, 0.2)',
  padding: '0.5rem',
  borderRadius: '2px',
  fontFamily: ({ theme }) => theme.bodyFont,
  fontSize: '14px',
  width: ['50px', '75px', '75px', '75px'],
  height: '36px',
  textAlign: 'center',

  '&[type=number]::-webkit-inner-spin-button': {
    opacity: 1
  },
  '&[type=number]::-webkit-outer-spin-button': {
    opacity: 1
  }
});

const ProductOptions = styled(({ className }) => {
  const {
    strategy,
    enableVariantSelection,
    enableQuantitySelection,
    offeredProducts,
    selectedVariants,
    selectedQuantities,
    maxQuantities,
    handleVariantChange
  } = useContext(StateContext);
  const offeredProduct = offeredProducts[0];
  const selectedVariant = selectedVariants[0];
  const selectedQuantity = selectedQuantities[0];
  const maxQuantity = maxQuantities[0];

  return (
    <div className={className}>
      {enableVariantSelection && offeredProduct.variants.length > 1 && (
        <VariantSelect
          value={selectedVariant.id}
          onChange={(event) => handleVariantChange(0, event.target.value)}
        >
          {offeredProduct.variants.map((variant, index) => (
            <option
              key={index}
              value={variant.id}
              disabled={!variant.hasInventory}
            >
              {variant.title}
            </option>
          ))}
        </VariantSelect>
      )}
      {enableQuantitySelection && strategy === 'CROSS_SELL' && (
        <QuantityInput
          type="number"
          value={selectedQuantity}
          min={1}
          max={maxQuantity}
        />
      )}
    </div>
  );
})({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '1rem',
  margin: '0.5rem -0.25rem -0.25rem -0.25rem',

  '> *': {
    margin: '0.25rem'
  }
});

export default ProductOptions;
