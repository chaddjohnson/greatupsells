import React, { useContext } from 'react';
import { useTheme } from 'styled-components';
import tinycolor from 'tinycolor2';
import styled from '@greatupsells/styled-with-facepaint';
import { StateContext } from '../../components';
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
    fontSize: '1.0625rem'
  },
  '& > span + span': {
    fontSize: '1.125rem',
    marginLeft: '0.25rem'
  }
});

const Savings = styled.div({
  color: ({ theme }) => theme.originalPriceTextColor,
  marginTop: '0.25rem',

  '& > span': {
    fontSize: '0.9375rem'
  },
  '& > span + span': {
    fontSize: '1rem',
    marginLeft: '0.25rem'
  }
});

const BundleOptions = styled.div({
  display: 'flex',
  justifyContent: 'center'
});

const AddBundleButton = styled(Button)({
  width: '100%',
  minWidth: '100px',

  '&:disabled': {
    backgroundColor: ({ theme }) =>
      tinycolor(theme.popupBackgroundColor).isLight()
        ? tinycolor(theme.popupBackgroundColor).darken(10)
        : tinycolor(theme.popupBackgroundColor).lighten(10)
  }
});

const Footer = styled(({ className }) => {
  const theme = useTheme();
  const {
    enableBundling,
    subtotalFormatted,
    savingsFormatted,
    handleAddProductBundle,
    addProductBundleEnabled,
    addingProductBundle
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
      <BundleOptions>
        <AddBundleButton
          onClick={handleAddProductBundle}
          disabled={!addProductBundleEnabled}
          loading={addingProductBundle}
        >
          {bundleAddButtonText}
        </AddBundleButton>
      </BundleOptions>
    </footer>
  );
})({
  display: ['block', 'flex', 'flex', 'flex'],
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: ['0.5rem', '1.25rem', '1.25rem', '1.25rem']
});

export default Footer;
