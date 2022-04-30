import React, { useContext } from 'react';
import { useTheme } from 'styled-components';
import styled from '@greatupsells/styled-with-facepaint';
import StateContext from '../StateContext';
import Button from './Button';

const Totals = styled.div({
  textAlign: ['center', 'right', 'right', 'right'],
  flex: 0,
  whiteSpace: 'nowrap',
  marginTop: ['1rem', 0, 0, 0],
  marginBottom: ['1rem', 0, 0, 0]
});

const Subtotal = styled.div({
  fontWeight: 500,
  color: ({ theme }) => theme.salePriceTextColor,
  marginBottom: '0.25rem',

  '& > span': {
    fontSize: '17px'
  },
  '& > span + span': {
    fontSize: '18px'
  }
});

const Savings = styled.div({
  color: ({ theme }) => theme.originalPriceTextColor,
  marginTop: '0.25rem',

  '&.savings > span': {
    fontSize: '15px'
  },
  '&.savings > span + span': {
    fontSize: '16px'
  }
});

const BundleOptions = styled.div({
  display: 'flex',
  justifyContent: 'center'
});

const AddBundleButton = styled(Button)({
  width: '100%',
  minWidth: '100px'
});

const Footer = styled(({ className }) => {
  const theme = useTheme();
  const {
    subtotalFormatted,
    savingsFormatted,
    handleAddProductBundle,
    addProductBundleEnabled,
    addProductBundle
  } = useContext(StateContext);

  const { bundleAddButtonText } = theme;

  return (
    <footer className={className}>
      <Totals>
        <Subtotal>
          <span>Subtotal:</span>
          <span>{subtotalFormatted}</span>
        </Subtotal>
        <Savings>
          <span>You save:</span>
          <span>{savingsFormatted}</span>
        </Savings>
      </Totals>
      <BundleOptions>
        <AddBundleButton
          onClick={handleAddProductBundle}
          enabled={addProductBundleEnabled}
          loading={addProductBundle}
        >
          {bundleAddButtonText}
        </AddBundleButton>
      </BundleOptions>
    </footer>
  );
})({
  display: ['block', 'block', 'block', 'flex'],
  alignItems: ['left', 'left', 'left', 'center'],
  justifyContent: 'space-between',
  marginTop: '0.5rem'
});

export default Footer;
