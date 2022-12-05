import React, { useContext } from 'react';
import { useTheme } from 'styled-components';
import styled from '@greatupsells/styled-with-facepaint';
import { StateContext } from '../../components';
import Button from './Button';

const Totals = styled.div({
  flex: 0,
  whiteSpace: 'nowrap'
});

const Subtotal = styled.div({
  fontWeight: 500,
  color: ({ theme }) => theme.salePriceTextColor,
  marginBottom: '0.25rem',

  '& > span': {
    fontSize: '16px'
  },
  '& > span + span': {
    fontSize: '17px'
  }
});

const Savings = styled.div({
  color: ({ theme }) => theme.originalPriceTextColor,
  marginTop: '0.25rem',

  '& > span': {
    fontSize: '14px'
  },
  '& > span + span': {
    fontSize: '15px'
  }
});

const BundleActions = styled.div({
  display: 'flex',
  justifyContent: 'center'
});

const AddBundleButton = styled(Button)({
  width: '100%',
  minWidth: '100px',
  maxWidth: ['150px', 'none', 'none', 'none']
});

const Footer = styled(({ className }) => {
  const theme = useTheme();
  const {
    enableBundling,
    subtotalFormatted,
    savingsFormatted,
    addProductBundleEnabled,
    addingProductBundle,
    handleThankYouPageAddProductBundle
  } = useContext(StateContext);
  const { bundleAddButtonText } = theme;

  if (!enableBundling) {
    return null;
  }

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
      <BundleActions>
        <AddBundleButton
          onClick={handleThankYouPageAddProductBundle}
          disabled={!addProductBundleEnabled}
          loading={addingProductBundle}
        >
          {bundleAddButtonText}
        </AddBundleButton>
      </BundleActions>
    </footer>
  );
})({
  display: 'flex',
  marginTop: '1.5rem',
  alignItems: 'center',
  justifyContent: 'space-between'
});

export default Footer;
