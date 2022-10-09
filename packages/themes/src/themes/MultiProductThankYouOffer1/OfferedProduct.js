import React, { useContext } from 'react';
import { useTheme } from 'styled-components';
import styled from '@greatupsells/styled-with-facepaint';
import { StateContext } from '../../components';
import Button from './Button';

const ProductImageContainer = styled.div({
  backgroundColor: '#FFFFFF',
  margin: 'auto',
  marginRight: ['1rem', '1.5rem', '1.5rem', '1.5rem'],
  textAlign: 'center',
  width: '64px',
  height: '64px',
  flexBasis: 'auto',
  position: 'relative',

  '&::after': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: '8px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    zIndex: 2
  }
});

const ProductImageContainerInner = styled.div({
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '8px',
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const ProductImage = styled.img({
  width: 'auto',
  height: 'auto',
  maxWidth: '100%',
  maxHeight: '100%'
});

const OfferedProductDetails = styled.div({
  flex: 1
});

const OfferedProductTitleLink = styled.a({
  display: 'flex',
  color: ({ theme }) => theme.productTitleTextColor,
  fontWeight: 500,
  marginRight: [0, '1rem'],
  textDecoration: 'none',

  '&:hover': {
    color: 'inherit'
  }
});

const OfferedProductPrices = styled.div({
  marginTop: '0.25rem',
  marginBottom: '0.5rem'
});

const OfferedProductPrice = styled.s({
  color: ({ theme }) => theme.originalPriceTextColor,
  marginRight: '0.15rem'
});

const OfferedProductSalePrice = styled.span({
  color: ({ theme }) => theme.salePriceTextColor,
  marginLeft: '0.15rem'
});

const OfferedProductInputs = styled.div({
  display: 'flex'
});

const Select = styled.select({
  background: ({ theme }) =>
    `${theme.inputBackgroundColor} url('data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0Ljk1IDEwIj48ZGVmcz48c3R5bGU+LmNscy0ye2ZpbGw6IzQ0NDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmFycm93czwvdGl0bGU+PHBvbHlnb24gY2xhc3M9ImNscy0yIiBwb2ludHM9IjEuNDEgNC42NyAyLjQ4IDMuMTggMy41NCA0LjY3IDEuNDEgNC42NyIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIzLjU0IDUuMzMgMi40OCA2LjgyIDEuNDEgNS4zMyAzLjU0IDUuMzMiLz48L3N2Zz4=') no-repeat right 2px center`,
  border: '1px solid rgba(0, 0, 0, 0.2)',
  padding: '0 0.5rem',
  height: '34px',
  borderRadius: '5px',
  color: ({ theme }) => theme.inputTextColor,
  backgroundColor: ({ theme }) => theme.inputBackgroundColor,
  MozAppearance: 'none',
  WebkitAppearance: 'none',
  appearance: 'none',
  width: '100%',
  flex: 1,
  marginRight: '0.25rem',
  marginTop: ({ theme }) => (theme.showPrices ? 0 : '0.75rem'),
  maxWidth: ['none', '150px', '150px', '150px']
});

const Input = styled.input({
  border: '1px solid rgba(0, 0, 0, 0.2)',
  padding: '0 0.5rem',
  height: '34px',
  borderRadius: '5px',
  color: ({ theme }) => theme.inputTextColor,
  backgroundColor: ({ theme }) => theme.inputBackgroundColor,
  width: '64px',
  textAlign: 'center',
  flex: '0 0 auto',

  '::-webkit-inner-spin-button': {
    opacity: 1
  },
  '::-webkit-outer-spin-button': {
    opacity: 1
  }
});

const OfferedProductActions = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flexBasis: ['100%', 'auto', 'auto', 'auto'],
  alignItems: 'center',
  minWidth: '100px',
  marginTop: ['0.75rem', 0, 0, 0],

  '> *': {
    marginBottom: '0.5rem'
  }
});

const AddButton = styled(Button)({
  margin: 'auto',
  width: ['100%', 'auto', 'auto', 'auto'],
  minWidth: '100px',
  maxWidth: ['none', '175px', '175px', '175px']
});

const OfferedProduct = styled(({ className, offeredProduct, index }) => {
  const theme = useTheme();
  const {
    selectedVariants,
    selectedQuantities,
    maxQuantities,
    addingProductEnabled,
    addingProduct,
    enableBundling,
    enableVariantSelection,
    enableQuantitySelection,
    handleVariantChange,
    handleQuantityChange,
    handleThankYouPageAddProduct
  } = useContext(StateContext);
  const { showPrices, showOriginalPrice, addButtonText } = theme;
  const { variants } = offeredProduct;
  const selectedVariant = selectedVariants[index];
  const selectedQuantity = selectedQuantities[index];
  const maxQuantity = maxQuantities[index];

  return (
    <div className={className}>
      <ProductImageContainer>
        <ProductImageContainerInner>
          <ProductImage
            src={selectedVariant.thumbnailImage.src}
            alt={selectedVariant.thumbnailImage.alt}
          />
        </ProductImageContainerInner>
      </ProductImageContainer>
      <OfferedProductDetails>
        <OfferedProductTitleLink
          href={selectedVariant.url}
          title={offeredProduct.title}
          target="_blank"
          rel="noopener noreferrer"
          dangerouslySetInnerHTML={{ __html: offeredProduct.title }}
        />
        {showPrices && (
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
        )}
        {(enableVariantSelection || enableQuantitySelection) && (
          <OfferedProductInputs>
            {enableVariantSelection && variants.length > 1 && (
              <Select
                onChange={(event) =>
                  handleVariantChange(index, event.target.value)
                }
              >
                {variants.map((variant) => (
                  <option
                    key={variant.id}
                    value={variant.id}
                    selected={selectedVariant[index]?.id === variant.id}
                    disabled={!variant.hasInventory}
                  >
                    {variant.title}
                  </option>
                ))}
              </Select>
            )}
            {enableQuantitySelection && (
              <Input
                type="number"
                value={selectedQuantity}
                min={1}
                max={maxQuantity}
                onChange={(event) =>
                  handleQuantityChange(index, event.target.value)
                }
              />
            )}
          </OfferedProductInputs>
        )}
      </OfferedProductDetails>
      <OfferedProductActions>
        {!enableBundling && (
          <AddButton
            disabled={!addingProductEnabled[index]}
            loading={addingProduct[index]}
            onClick={() => handleThankYouPageAddProduct(index)}
          >
            {addButtonText}
          </AddButton>
        )}
      </OfferedProductActions>
    </div>
  );
})({
  display: 'flex',
  alignItems: 'flex-start',
  position: 'relative',
  marginBottom: '1.5rem',
  flexWrap: ['wrap', 'nowrap', 'nowrap', 'nowrap'],

  '&:last-of-type': {
    marginBottom: 0
  }
});

export default OfferedProduct;
