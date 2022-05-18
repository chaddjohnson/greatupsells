import React, { useContext } from 'react';
import { useTheme } from 'styled-components';
import styled from '@greatupsells/styled-with-facepaint';
import { StateContext } from '../../components';
import Button from './Button';

const OfferedProductImageContainer = styled.div({
  border: '1px solid rgba(0, 0, 0, 0.2)',
  borderRadius: '0.625rem',
  backgroundColor: '#FFFFFF',
  margin: '0 auto',
  textAlign: 'center',
  display: ['block', 'flex', 'flex', 'flex'],
  justifyContent: 'center',
  alignItems: 'center',
  width: '150px',
  height: '150px'
});

const OfferedProductImage = styled.img({
  width: 'auto',
  height: 'auto',
  maxWidth: '134px',
  maxHeight: '134px'
});

const OfferedProductPrices = styled.div({
  marginTop: '0.25rem',
  marginBottom: '0.5rem'
});

const OfferedProductPrice = styled.s({
  fontWeight: 700,
  color: ({ theme }) => theme.originalPriceTextColor,
  marginRight: '0.15rem'
});

const FigureCaption = styled.figcaption({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '0.5rem',
  textAlign: 'center'
});

const OfferedProductDetails = styled.div({
  flex: 1
});

const OfferedProductTitleLink = styled.a({
  color: 'inherit',
  textDecoration: 'none',
  fontWeight: 500,
  display: 'block',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  width: '150px'
});

const OfferedProductSalePrice = styled.span({
  fontWeight: 700,
  color: ({ theme }) => theme.salePriceTextColor,
  marginLeft: '0.15rem'
});

const OfferedProductOptions = styled.div({
  display: 'flex',
  flexDirection: 'column',

  '> *': {
    marginBottom: '0.5rem'
  }
});

const VariantSelect = styled.select({
  border: '1px solid rgba(0, 0, 0, 0.2)',
  padding: '0.5rem',
  borderRadius: '5px',
  fontFamily: ({ theme }) => theme.bodyFont,
  fontSize: '13px',
  width: '150px',
  background:
    'url("data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0Ljk1IDEwIj48ZGVmcz48c3R5bGU+LmNscy0ye2ZpbGw6IzQ0NDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmFycm93czwvdGl0bGU+PHBvbHlnb24gY2xhc3M9ImNscy0yIiBwb2ludHM9IjEuNDEgNC42NyAyLjQ4IDMuMTggMy41NCA0LjY3IDEuNDEgNC42NyIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIzLjU0IDUuMzMgMi40OCA2LjgyIDEuNDEgNS4zMyAzLjU0IDUuMzMiLz48L3N2Zz4=") no-repeat right 2px center',
  MozAppearance: 'none',
  WebkitAppearance: 'none',
  appearance: 'none'
});

const QuantityInput = styled.input({
  border: ' 1px solid rgba(0, 0, 0, 0.2)',
  padding: '0.5rem',
  borderRadius: '5px',
  fontFamily: ({ theme }) => theme.bodyFont,
  fontSize: '0.8125rem',
  width: '75px',
  textAlign: 'center',

  '&::-webkit-inner-spin-button': {
    opacity: 1
  },
  '&::-webkit-outer-spin-button': {
    opacity: 1
  }
});

const AddButton = styled(Button)({
  width: '131px',
  margin: 'auto'
});

const OfferedProduct = styled(({ className, offeredProduct, index }) => {
  const theme = useTheme();
  const {
    strategy,
    selectedVariants,
    selectedQuantities,
    maxQuantities,
    addingProductEnabled,
    addingProduct,
    enableBundling,
    enableVariantSelection,
    enableQuantitySelection,
    triggerProduct,
    replacingProductEnabled,
    handleVariantChange,
    handleAddProduct,
    handleReplaceProduct
  } = useContext(StateContext);
  const { showOriginalPrice, addButtonText } = theme;
  const { variants } = offeredProduct;
  const selectedVariant = selectedVariants[index];
  const selectedQuantity = selectedQuantities[index];
  const maxQuantity = maxQuantities[index];

  return (
    <figure className={className}>
      <OfferedProductImageContainer>
        <a href={selectedVariant.url} target="_blank" rel="noopener noreferrer">
          <OfferedProductImage
            src={selectedVariant.image.src}
            alt={selectedVariant.image.alt}
          />
        </a>
      </OfferedProductImageContainer>
      <FigureCaption>
        <OfferedProductDetails>
          <div>
            <OfferedProductTitleLink
              href={selectedVariant.url}
              title={offeredProduct.title}
              target="_blank"
              rel="noopener noreferrer"
            >
              {offeredProduct.title}
            </OfferedProductTitleLink>
          </div>
          <OfferedProductPrices>
            {showOriginalPrice && (
              <OfferedProductPrice>
                {selectedVariant.priceFormatted}
              </OfferedProductPrice>
            )}
            <OfferedProductSalePrice>
              {selectedVariant.salePriceFormatted}
            </OfferedProductSalePrice>
          </OfferedProductPrices>
        </OfferedProductDetails>
        <OfferedProductOptions>
          {enableVariantSelection && variants.length > 1 && (
            <VariantSelect
              value={selectedVariant.id}
              onChange={(event) =>
                handleVariantChange(index, event.target.value)
              }
            >
              {variants.map((variant, variantIndex) => (
                <option
                  key={variantIndex}
                  value={variant.id}
                  disabled={!variant.hasInventory}
                >
                  {variant.title}
                </option>
              ))}
            </VariantSelect>
          )}
          {enableQuantitySelection && strategy === 'CROSS_SELL' && (
            <div>
              <QuantityInput
                type="number"
                value={selectedQuantity}
                min={1}
                max={maxQuantity}
                // onChange={} // TODO
              />
            </div>
          )}
          {!enableBundling && strategy === 'CROSS_SELL' && (
            <AddButton
              disabled={!addingProductEnabled[index]}
              loading={addingProduct[index]}
              onClick={() => handleAddProduct(index)}
            >
              {addButtonText}
            </AddButton>
          )}
          {!enableBundling && strategy === 'UPSELL' && (
            <AddButton
              disabled={!replacingProductEnabled[index]}
              loading={addingProduct[index]}
              onClick={() => handleReplaceProduct(triggerProduct.id, index)}
            >
              {addButtonText}
            </AddButton>
          )}
        </OfferedProductOptions>
      </FigureCaption>
    </figure>
  );
})({
  margin: 0,
  position: 'relative',

  '&:not(:last-of-type)::after': {
    content: "'add_circle'",
    fontFamily: "'Material Icons'",
    fontSize: '32px',
    color: '#999999',
    position: 'absolute',
    zIndex: 10,
    right: '-1.25rem',
    top: '50%',
    transform: 'translate(65%, -50%)',
    backgroundColor: ({ theme }) => theme.productBackgroundColor,
    borderRadius: '50%',
    display: ({ theme }) =>
      !theme.enableBundling || !theme.showBundlePlusSymbol ? 'none' : 'block'
  }
});

export default OfferedProduct;
