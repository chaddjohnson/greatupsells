import React, { useContext } from 'react';
import { useTheme } from 'styled-components';
import styled from '@greatupsells/styled-with-facepaint';
import { StateContext } from '../../components';
import Button from './Button';

const TriggerProductImageContainer = styled.div({
  order: [2, 1, 1, 1],
  display: ['none', 'flex', 'flex', 'flex'],
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
  maxWidth: '75px',
  maxHeight: '75px'
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

const CartSubtotal = styled.div({
  fontWeight: 500,
  whiteSpace: 'nowrap',
  display: ['none', 'block', 'block', 'block']
});

const ActionButton = styled(Button)({
  backgroundColor: ({ theme }) => theme.actionButtonBackgroundColor,
  color: ({ theme }) => theme.actionButtonTextColor,
  marginTop: ['0.5rem', '0.75rem', '0.75rem', '0.75rem'],
  marginLeft: ['2rem', 0, 0, 0],
  marginRight: ['2rem', 0, 0, 0],

  '&:hover': {
    backgroundColor: ({ theme }) => theme.actionButtonHoverBackgroundColor,
    color: ({ theme }) => theme.actionButtonTextHoverColor
  }
});

const AddedIconContainer = styled.div({
  display: 'inline-block',
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,

  '::after': {
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

const TriggerProduct = styled(({ className }) => {
  const theme = useTheme();
  const {
    strategy,
    triggerProduct,
    actionButtonUrl,
    actionButtonTarget,
    shopifyCartTotalFormatted
  } = useContext(StateContext);
  const { addedText, actionButtonText } = theme;
  const showTriggerProduct =
    (strategy === 'UPSELL' || theme.showTriggerProduct) && triggerProduct;

  if (!showTriggerProduct) {
    return null;
  }

  return (
    <div className={className}>
      <TriggerProductImageContainer>
        <AddedIconContainer />
        <TriggerProductImage
          src={triggerProduct.image.src}
          alt={triggerProduct.image.alt}
        />
      </TriggerProductImageContainer>
      <TriggerProductDetails>
        <div>
          <strong>{addedText}</strong>
        </div>
        <TriggerProductTitle>{triggerProduct.title}</TriggerProductTitle>
      </TriggerProductDetails>
      <TriggerProductOptions>
        <CartSubtotal>Cart subtotal: {shopifyCartTotalFormatted}</CartSubtotal>
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
  display: [
    ({ theme }) => (theme.enableBundling ? 'none' : 'flex'),
    'flex',
    'flex',
    'flex'
  ],
  flexWrap: ['wrap', 'nowrap', 'nowrap', 'nowrap'],
  alignItems: 'center',
  padding: '1rem',
  color: ({ theme }) => theme.triggerProductTextColor,
  backgroundColor: ({ theme }) => theme.triggerProductBackgroundColor,
  borderRadius: '5px',
  minWidth: '11rem',
  marginTop: '1rem',
  marginBottom: [0, '-0.5rem', '-0.5rem', '-0.5rem'],
  marginLeft: ['1rem', '1.75rem', '1.75rem', '1.75rem'],
  marginRight: ['1rem', '1.75rem', '1.75rem', '1.75rem'],
  textAlign: ['center', 'left', 'left', 'left'],

  '> *': {
    flexBasis: ['100%', 'auto', 'auto', 'auto']
  }
});

export default TriggerProduct;
