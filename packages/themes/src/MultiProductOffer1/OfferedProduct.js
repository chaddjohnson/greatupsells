import React, { useContext } from 'react';
import { useTheme } from 'styled-components';
import styled from '@greatupsells/styled-with-facepaint';
import StateContext from '../StateContext';
import ProductImageContainer from './ProductImageContainer';
import ProductImage from './ProductImage';
import Button from './Button';
import Select from './Select';
import Input from './Input';
import Icon from './Icon';

const OfferedProductTitle = styled.a({
  color: ({ theme }) => theme.productTitleTextColor,
  textDecoration: 'none',
  display: 'inline-block'
});

const OfferedProductDetails = styled.div({
  flex: 1
});

const OfferedProductPrices = styled.div({
  marginTop: '0.25rem',
  marginBottom: '0.5rem'
});

const AddButton = styled(Button)({
  margin: 'auto',
  width: ['150px', 'auto', 'auto', 'auto'],
  minWidth: '100px'
});

const OfferedProductPrice = styled.s({
  color: ({ theme }) => theme.originalPriceTextColor,
  marginRight: '0.15rem'
});

const OfferedProductSalePrice = styled.span({
  color: ({ theme }) => theme.salePriceTextColor,
  marginLeft: '0.15rem'
});

const OfferedProductOptions = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flexBasis: ['100%', 'auto', 'auto', 'auto'],
  alignItems: 'center',
  minWidth: ['none', '100px', '100px', '100px'],

  '& > *': {
    marginBottom: '0.5rem'
  }
});

const AddedProductIcon = styled(Icon)({
  fontSize: '2rem',
  color: '#008160',
  backgroundColor: 'white',
  borderRadius: '50%'
});

const OfferedProduct = styled(({ className, offeredProduct, index }) => {
  const theme = useTheme();
  const {
    selectedVariants,
    selectedQuantities,
    addedQuantities,
    maxQuantity,
    addProductEnabled,
    addingProduct,
    enableBundling,
    enableVariantSelection,
    enableQuantitySelection,
    triggerProduct,
    replacingProductEnabled,
    handleVariantChange,
    handleAddProduct,
    handleReplaceProduct,
    strategy
  } = useContext(StateContext);
  const { showPrices, showOriginalPrice, addButtonText } = theme;
  const { variants } = offeredProduct;
  const selectedVariant = selectedVariants[index];

  return (
    <div className={className}>
      <ProductImageContainer>
        <a href={selectedVariant.url} target="_blank" rel="noopener noreferrer">
          <ProductImage
            src={selectedVariant.image.src}
            alt={selectedVariant.image.alt}
          />
        </a>
      </ProductImageContainer>
      <OfferedProductDetails>
        <div>
          <OfferedProductTitle
            href={selectedVariant.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {offeredProduct.title}
          </OfferedProductTitle>
        </div>
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
        {enableVariantSelection && variants.length > 1 && (
          <div>
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
          </div>
        )}
      </OfferedProductDetails>
      <OfferedProductOptions>
        {enableQuantitySelection && strategy === 'CROSS_SELL' && (
          <div>
            <Input
              type="number"
              value={selectedQuantities[index]}
              min={1}
              max={maxQuantity[index]}
              // onChange={} // TODO
            />
          </div>
        )}
        {!enableBundling && (
          <>
            {strategy === 'CROSS_SELL' && (
              <AddButton
                onClick={() => handleAddProduct(index)}
                disabled={!addProductEnabled[index]}
                loading={addingProduct[index]}
              >
                {addButtonText}
              </AddButton>
            )}
            {strategy === 'UPSELL' && (
              <>
                {addedQuantities[index] === 0 && (
                  <AddButton
                    onClick={() =>
                      handleReplaceProduct(triggerProduct.id, index)
                    }
                    disabled={!replacingProductEnabled[index]}
                    loading={addingProduct[index]}
                  >
                    {addButtonText}
                  </AddButton>
                )}
                {addedQuantities[index] > 0 && (
                  <AddedProductIcon name="check" />
                )}
              </>
            )}
          </>
        )}
      </OfferedProductOptions>
    </div>
  );
})({
  display: 'flex',
  flexWrap: ['wrap', 'nowrap', 'nowrap', 'nowrap'],
  alignItems: 'center',
  marginRight: ['0.5rem', 0, 0, 0],
  marginBottom: [0, '0.5rem', '0.5rem', '0.5rem'],
  padding: '1rem 1.5rem',
  backgroundColor: ({ theme }) => theme.productBackgroundColor,
  border: '1px solid #E3E3E3',
  borderRadius: '5px',
  minWidth: '11rem',
  textAlign: ['center', 'left', 'left', 'left'],
  position: 'relative',

  '&:not(:last-of-type)::after': {
    content: 'add_circle',
    fontFamily: 'Material Icons',
    fontSize: '32px',
    color: '#999999',
    position: 'absolute',
    zIndex: 10,
    right: [0, 'auto', 'auto', 'auto'],
    left: ['auto', '50%', '50%', '50%'],
    top: ['50%', 'auto', 'auto', 'auto'],
    bottom: ['auto', 0, 0, 0],
    transform: [
      'translate(65%, -50%)',
      'translate(-50%, 65%)',
      'translate(-50%, 65%)',
      'translate(-50%, 65%)'
    ],
    backgroundColor: ({ theme }) => theme.productBackgroundColor,
    borderRadius: '50%',
    display: ({ theme }) =>
      !theme.enableBundling || !theme.showBundlePlusSymbol ? 'none' : 'block'
  }
});

export default OfferedProduct;
