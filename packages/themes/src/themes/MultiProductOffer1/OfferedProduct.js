import React, { useState, useContext, useEffect } from 'react';
import { useTheme } from 'styled-components';
import styled from '@greatupsells/styled-with-facepaint';
import { StateContext } from '../../components';
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
  const [actionDone, setActionDone] = useState(false);

  const theme = useTheme();
  const {
    selectedVariants,
    selectedQuantities,
    addedQuantities,
    maxQuantities,
    addingProductEnabled,
    addingProduct,
    enableBundling,
    enableVariantSelection,
    enableQuantitySelection,
    triggerProduct,
    replacingProductEnabled,
    actionButtonUrl,
    performActionOnAdd,
    handleVariantChange,
    handleQuantityChange,
    handleAddProduct,
    handleReplaceProduct,
    strategy
  } = useContext(StateContext);
  const { showPrices, showOriginalPrice, addButtonText } = theme;
  const { variants } = offeredProduct;
  const selectedVariant = selectedVariants[index];

  const handleAddButton = async () => {
    await handleAddProduct(index);
    setActionDone(true);
  };

  const handleReplaceButton = async () => {
    await handleReplaceProduct(triggerProduct.id, index);
    setActionDone(true);
  };

  useEffect(() => {
    if (!actionDone) {
      return;
    }
    if (!performActionOnAdd) {
      return;
    }

    if (typeof actionButtonUrl === 'string') {
      window.location.href = actionButtonUrl;
    } else if (typeof actionButtonUrl === 'function') {
      actionButtonUrl();
    }
  }, [actionButtonUrl, actionDone, performActionOnAdd]);

  return (
    <div className={className}>
      <ProductImageContainer>
        <a href={selectedVariant.url} target="_blank" rel="noopener noreferrer">
          <ProductImage
            src={selectedVariant.thumbnailImage.src}
            alt={selectedVariant.thumbnailImage.alt}
          />
        </a>
      </ProductImageContainer>
      <OfferedProductDetails>
        <div>
          <OfferedProductTitle
            href={selectedVariant.url}
            target="_blank"
            rel="noopener noreferrer"
            dangerouslySetInnerHTML={{ __html: offeredProduct.title }}
          />
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
              max={maxQuantities[index]}
              onChange={(event) =>
                handleQuantityChange(index, event.target.value)
              }
            />
          </div>
        )}
        {!enableBundling && (
          <>
            {strategy === 'CROSS_SELL' && (
              <AddButton
                disabled={!addingProductEnabled[index]}
                loading={addingProduct[index]}
                onClick={handleAddButton}
              >
                {addButtonText}
              </AddButton>
            )}
            {strategy === 'UPSELL' && (
              <>
                {addedQuantities[index] === 0 && (
                  <AddButton
                    disabled={!replacingProductEnabled[index]}
                    loading={addingProduct[index]}
                    onClick={handleReplaceButton}
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

  '&:last-of-type': {
    marginBottom: 0
  }
});

export default OfferedProduct;
