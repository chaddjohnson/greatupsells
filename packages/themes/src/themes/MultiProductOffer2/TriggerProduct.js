import React, { useContext } from 'react';
import { useTheme } from 'styled-components';
import styled from '@greatupsells/styled-with-facepaint';
import { StateContext } from '../../components';
import Button from './Button';

const TriggerProductImageContainer = styled.div({
  order: [2, 1, 1, 1],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.15rem',
  marginRight: ['auto', '1.5rem', '1.5rem', '1.5rem'],
  marginLeft: 'auto',
  marginTop: [0, 'auto', 'auto', 'auto'],
  marginBottom: ['0.5rem', 'auto', 'auto', 'auto'],
  borderRadius: '0.625em',
  border: '1px solid rgba(0, 0, 0, 0.2)',
  textAlign: 'center',
  width: '80px',
  height: '80px',
  flexBasis: ['100%', 'auto', 'auto', 'auto'],
  position: 'relative',
  backgroundColor: ({ theme }) => theme.popupBackgroundColor
});

const TriggerProductImage = styled.img({
  width: 'auto',
  height: 'auto',
  maxWidth: '80px',
  maxHeight: '80px'
});

const TriggerProductDetails = styled.div({
  flex: 1,
  order: [1, 2, 2, 2],
  marginRight: [0, '1rem', '1rem', '1rem'],
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

const CartItems = styled.div({
  color: ({ theme }) => theme.cartItemsTextColor,
  display: ['none', 'block', 'block', 'block']
});

const ActionButton = styled(Button)({
  backgroundColor: ({ theme }) => theme.actionButtonBackgroundColor,
  color: ({ theme }) => theme.actionButtonTextColor,
  marginTop: '0.75rem',
  marginLeft: ['2rem', 0, 0, 0],
  marginRight: ['2rem', 0, 0, 0],

  '&:hover': {
    backgroundColor: ({ theme }) => theme.actionButtonHoverBackgroundColor,
    color: ({ theme }) => theme.actionButtonTextHoverColor
  }
});

const AddedIconContainer = styled.span({
  display: 'inline-block',
  position: 'relative',

  '::after': {
    content: "'check_circle'",
    fontFamily: "'Material Icons'",
    fontSize: ['1.25rem', '1.5rem', '1.5rem', '1.5rem'],
    position: 'absolute',
    top: '-0.5rem',
    right: '-0.5rem',
    color: '#008160',
    backgroundColor: 'white',
    borderRadius: '50%'
  }
});

const TriggerProduct = styled(({ className }) => {
  const theme = useTheme();
  const {
    actionButtonUrl,
    actionButtonTarget,
    triggerProduct,
    shopifyCartItemCount,
    shopifyCartTotalFormatted
  } = useContext(StateContext);
  const { addedText, actionButtonText } = theme;

  return (
    <div className={className}>
      <TriggerProductImageContainer>
        <AddedIconContainer>
          <TriggerProductImage
            src={triggerProduct.image.src}
            alt={triggerProduct.image.alt}
          />
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
          <CartSubtotal>
            Cart subtotal: {shopifyCartTotalFormatted}
          </CartSubtotal>
        </div>
        <CartItems>({shopifyCartItemCount} items)</CartItems>
        <ActionButton
          as="a"
          href={
            typeof actionButtonUrl === 'string' ? actionButtonUrl : undefined
          }
          onClick={
            typeof actionButtonUrl === 'function' ? actionButtonUrl : undefined
          }
          target={actionButtonTarget}
        >
          {actionButtonText}
        </ActionButton>
      </TriggerProductOptions>
    </div>
  );
})({
  display: 'flex',
  flexWrap: ['wrap', 'nowrap', 'nowrap', 'nowrap'],
  alignItems: 'center',
  padding: '1.5rem 1.5rem',
  color: ({ theme }) => theme.triggerProductTextColor,
  backgroundColor: ({ theme }) => theme.triggerProductBackgroundColor,
  border: '2px solid #E3E3E3',
  borderRadius: ['5px', '4.375px'],
  height: '5rem',
  minWidth: '11rem',
  marginTop: '1rem',
  marginBottom: [0, '-0.5rem', '-0.5rem', '-0.5rem'],
  marginLeft: '1.5rem',
  marginRight: '1.5rem',
  textAlign: ['center', 'left', 'left', 'left'],

  '> *': {
    flexBasis: ['100%', 'auto', 'auto', 'auto']
  }
});

export default TriggerProduct;
