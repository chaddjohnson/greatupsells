import React, { useContext } from 'react';
import { useTheme } from 'styled-components';
import tinycolor from 'tinycolor2';
import styled from '@greatupsells/styled-with-facepaint';
import { StateContext } from '../../components';
import Button from './Button';
import ProductImageContainer from './ProductImageContainer';
import ProductImage from './ProductImage';

const TriggerProductImageContainer = styled(ProductImageContainer)({
  order: [2, 1, 1, 1]
});

const AddedIconContainer = styled.span({
  display: 'inline-block',
  position: 'relative',

  '&::after': {
    content: '"check_circle"',
    fontFamily: 'Material Icons',
    fontSize: ['1.25rem', '1.5rem', '1.5rem', '1.5rem'],
    position: 'absolute',
    top: '-0.5rem',
    right: '-0.5rem',
    color: '#008160',
    backgroundColor: 'white',
    borderRadius: '50%'
  }
});

const TriggerProductDetails = styled.div({
  flex: 1,
  order: [1, 2, 2, 2],
  marginRight: [0, 0, 0, '1rem'],
  marginBottom: ['0.5rem', 0, 0, 0]
});

const TriggerProductTitle = styled.div({
  marginTop: '0.25rem'
});

const TriggerProductOptions = styled.div({
  order: 3
});

const CartSubtotal = styled.span({
  fontWeight: 500,
  whiteSpace: 'nowrap'
});

const ActionButton = styled(Button)({
  backgroundColor: ({ theme }) => theme.actionButtonBackgroundColor,
  color: ({ theme }) => theme.actionButtonTextColor,
  border: '1px solid #999999',
  marginTop: '0.75rem',
  marginLeft: ['2rem', 0, 0, 0],
  marginRight: ['2rem', 0, 0, 0],

  '&&:hover': {
    backgroundColor: ({ theme }) => tinycolor(theme.actionButtonBackgroundColor).darken(10)
  }
});

const TriggerProduct = styled(({ className }) => {
  const theme = useTheme();
  const { strategy, triggerProduct, shopifyCartTotalFormatted, actionButtonUrl, actionButtonTarget } =
    useContext(StateContext);
  const { addedText, actionButtonText } = theme;
  const showTriggerProduct = (strategy === 'UPSELL' || theme.showTriggerProduct) && triggerProduct;

  if (!showTriggerProduct) {
    return null;
  }

  return (
    <div className={className}>
      <TriggerProductImageContainer>
        <AddedIconContainer>
          <ProductImage src={triggerProduct.thumbnailImage.src} alt={triggerProduct.thumbnailImage.src} />
        </AddedIconContainer>
      </TriggerProductImageContainer>
      <TriggerProductDetails>
        <div>
          <strong>{addedText}</strong>
        </div>
        <TriggerProductTitle>{triggerProduct.title}</TriggerProductTitle>
      </TriggerProductDetails>
      <TriggerProductOptions>
        <div>
          <CartSubtotal>Cart subtotal: {shopifyCartTotalFormatted}</CartSubtotal>
        </div>
        <ActionButton
          as="a"
          href={typeof actionButtonUrl === 'string' ? actionButtonUrl : undefined}
          onClick={typeof actionButtonUrl === 'function' ? actionButtonUrl : undefined}
          target={actionButtonTarget}
        >
          {actionButtonText}
        </ActionButton>
      </TriggerProductOptions>
    </div>
  );
})({
  display: [({ theme }) => (theme.enableBundling ? 'none' : 'flex'), 'flex', 'flex', 'flex'],
  flexWrap: ['wrap', 'nowrap', 'nowrap', 'nowrap'],
  alignItems: 'center',
  padding: '1rem 1.5rem',
  backgroundColor: ({ theme }) => theme.productBackgroundColor,
  border: '1px solid #E3E3E3',
  borderRadius: '5px',
  minWidth: '11rem',
  textAlign: ['center', 'left', 'left', 'left'],
  marginBottom: [0, '1rem', '1rem', '1rem'],

  '& > *': {
    flexBasis: ['100%', 'auto', 'auto', 'auto']
  }
});

export default TriggerProduct;
