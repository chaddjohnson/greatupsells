import React, { useState, useContext, useEffect } from 'react';
import { useTheme } from 'styled-components';
import tinycolor from 'tinycolor2';
import styled from '@greatupsells/styled-with-facepaint';
import { StateContext } from '../../components';
import Button from './Button';

const Banner = styled.div({
  paddingLeft: '2.5rem',
  paddingRight: '2.5rem',
  paddingTop: ['1.5rem', '2rem', '2rem', '2rem'],
  paddingBottom: ['1.5rem', '2rem', '2rem', '2rem'],
  textAlign: 'center',
  fontSize: ({ theme }) => `${(theme.bodyFontSize * 1.25) / 16}rem`,
  fontWeight: 500,
  color: ({ theme }) => theme.bannerTextColor,
  backgroundColor: ({ theme }) => theme.bannerBackgroundColor,
  borderBottom: ({ theme }) => `3px solid ${tinycolor(theme.bannerBackgroundColor).darken(1.25)}`,
  marginTop: ['-1.5rem', '-2rem', '-2rem', '-2rem'],
  marginLeft: ['-1.5rem', '-2rem', '-2rem', '-2rem'],
  marginRight: ['-1.5rem', '-2rem', '-2rem', '-2rem'],
  marginBottom: [0, '1.5rem', '1.5rem', '1.5rem']
});

const Title = styled.h2({
  color: ({ theme }) => theme.titleTextColor,
  marginTop: 0,
  marginRight: '1rem',
  fontSize: ({ theme }) => `${(theme.bodyFontSize * 2) / 16}rem`,
  fontWeight: 500
});

const Columns = styled.div({
  display: 'flex',
  flexDirection: ['column', 'row', 'row', 'row'],
  margin: '-1.5rem',

  '> *': {
    margin: '1.5rem'
  }
});

const ImageContainer = styled.div({
  flexBasis: '50%',
  paddingLeft: '1rem',
  paddingRight: '1rem',
  paddingTop: ['1.5rem', '0.4rem', '0.4rem', '0.4rem'],
  marginBottom: [0, '1.5rem', '1.5rem', '1.5rem']
});

const Image = styled.img({
  width: 'auto',
  height: 'auto',
  maxWidth: '100%',
  maxHeight: ['150px', '100%', '100%', '100%'],
  display: 'block',
  margin: 'auto'
});

const Details = styled.div({
  flexBasis: '50%'
});

const Price = styled.span({
  color: ({ theme }) => theme.priceTextColor,
  textDecoration: 'line-through',
  fontSize: ({ theme }) => `${(theme.bodyFontSize * 1.2) / 16}rem`,
  fontWeight: 500
});

const SalePrice = styled.span({
  color: ({ theme }) => theme.salePriceTextColor,
  marginLeft: '0.75rem',
  fontSize: ({ theme }) => `${(theme.bodyFontSize * 1.25) / 16}rem`,
  fontWeight: 500
});

const Description = styled.div({
  lineHeight: 1.5,
  marginTop: '1rem',
  marginBottom: '1.5rem',
  maxHeight: '140px',
  overflowY: 'auto',

  'p:first-of-type': {
    marginTop: 0
  }
});

const FormControls = styled.div({
  marginTop: '1.5rem',
  marginBottom: '1rem',

  '> *': {
    display: 'block',
    marginTop: '1rem',
    marginBottom: '1rem'
  }
});

const FormActions = styled.div({
  marginTop: '1.5rem',
  marginBottom: '-1rem',
  borderTop: '1px solid rgba(0, 0, 0, 0.1)',
  paddingTop: '0.5rem',

  '> *': {
    marginTop: '1rem',
    marginBottom: '1rem'
  }
});

const Label = styled.label({
  display: 'none'
});

const Select = styled.select({
  border: '1px solid rgba(0, 0, 0, 0.2)',
  padding: '0.5rem 0.75rem',
  borderRadius: '5px',
  color: ({ theme }) => theme.bodyTextColor,
  fontFamily: ({ theme }) => theme.bodyFont,
  fontSize: ({ theme }) => `${theme.bodyFontSize / 16}rem`,
  width: '100%',
  height: '48px',
  background:
    "url('data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0Ljk1IDEwIj48ZGVmcz48c3R5bGU+LmNscy0ye2ZpbGw6IzQ0NDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmFycm93czwvdGl0bGU+PHBvbHlnb24gY2xhc3M9ImNscy0yIiBwb2ludHM9IjEuNDEgNC42NyAyLjQ4IDMuMTggMy41NCA0LjY3IDEuNDEgNC42NyIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIzLjU0IDUuMzMgMi40OCA2LjgyIDEuNDEgNS4zMyAzLjU0IDUuMzMiLz48L3N2Zz4=') no-repeat right 6px center",
  MozAppearance: 'none',
  WebkitAppearance: 'none',
  appearance: 'none'
});

const ActionButton = styled(Button)({
  color: ({ theme }) => theme.actionButtonTextColor,
  backgroundColor: ({ theme }) => theme.actionButtonBackgroundColor,
  width: '100%'
});

const CancelButton = styled(Button)({
  color: ({ theme }) => theme.actionButtonBackgroundColor,
  backgroundColor: ({ theme }) => theme.popupBackgroundColor,
  border: '1px solid rgba(0, 0, 0, 0.15)',
  width: '100%',

  '&:hover:not(:disabled)': {
    backgroundColor: ({ theme }) => theme.popupBackgroundColor
  }
});

const Body = styled(({ className }) => {
  const [actionDone, setActionDone] = useState(false);

  const { showBanner, showOriginalPrice, bannerText, actionButtonText, cancelButtonText } = useTheme();
  const {
    strategy,
    enableQuantitySelection,
    addingProductEnabled,
    addingProduct,
    replacingProductEnabled,
    triggerProduct,
    offeredProducts,
    actionButtonUrl,
    selectedVariants,
    selectedQuantities,
    maxQuantities,
    handleVariantChange,
    handleAddProduct,
    handleReplaceProduct,
    handleClose
  } = useContext(StateContext);
  const offeredProduct = offeredProducts[0];
  const { variants } = offeredProduct;
  const selectedVariant = selectedVariants[0];
  const selectedQuantity = selectedQuantities[0];
  const maxQuantity = maxQuantities[0];

  const handleAddButton = async () => {
    await handleAddProduct(0);
    setActionDone(true);
  };

  const handleReplaceButton = async () => {
    await handleReplaceProduct(triggerProduct.id, 0);
    setActionDone(true);
  };

  useEffect(() => {
    if (!actionDone) {
      return;
    }

    if (typeof actionButtonUrl === 'string') {
      window.location.href = actionButtonUrl;
    } else if (typeof actionButtonUrl === 'function') {
      actionButtonUrl();
    }
  }, [actionButtonUrl, actionDone]);

  return (
    <div className={className}>
      {showBanner && <Banner>{bannerText}</Banner>}
      <Columns>
        <ImageContainer>
          <Image src={selectedVariant.thumbnailImage.src} alt={selectedVariant.thumbnailImage.alt} />
        </ImageContainer>
        <Details>
          <Title dangerouslySetInnerHTML={{ __html: offeredProduct.title }} />
          <div>
            {showOriginalPrice && <Price>{selectedVariant.priceFormatted}</Price>}
            <SalePrice>{selectedVariant.salePriceFormatted}</SalePrice>
          </div>
          {offeredProduct.description && <Description dangerouslySetInnerHTML={{ __html: offeredProduct.description }} />}
          <FormControls>
            <Label for="variant">Variant</Label>
            <Select id="variant" value={selectedVariant.id} onChange={(event) => handleVariantChange(0, event.target.value)}>
              {variants.map((variant, index) => (
                <option key={index} value={variant.id} disabled={!variant.hasInventory}>
                  {variant.title}
                </option>
              ))}
            </Select>
            {enableQuantitySelection && strategy === 'CROSS_SELL' && (
              <>
                <Label for="quantity">Quantity</Label>
                <Select id="quantity" value={selectedQuantity}>
                  {[...Array(Math.min(maxQuantity || 25, 100)).keys()].map((index) => (
                    <option key={index} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </Select>
              </>
            )}
          </FormControls>
          <FormActions>
            {strategy === 'CROSS_SELL' && (
              <ActionButton
                type="submit"
                disabled={!addingProductEnabled[0]}
                loading={addingProduct[0]}
                onClick={handleAddButton}
              >
                {actionButtonText}
              </ActionButton>
            )}
            {strategy === 'UPSELL' && (
              <ActionButton
                type="button"
                disabled={!replacingProductEnabled[0]}
                loading={addingProduct[0]}
                onClick={handleReplaceButton}
              >
                {actionButtonText}
              </ActionButton>
            )}
            <CancelButton onClick={handleClose}>{cancelButtonText}</CancelButton>
          </FormActions>
        </Details>
      </Columns>
    </div>
  );
})({
  //
});

export default Body;
