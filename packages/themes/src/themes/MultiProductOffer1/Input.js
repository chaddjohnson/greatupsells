import React from 'react';
import styled from '@greatupsells/styled-with-facepaint';

const Input = styled.input({
  border: '1px solid rgba(0, 0, 0, 0.2)',
  padding: '0.5rem',
  borderRadius: '2px',
  fontFamily: ({ theme }) => theme.bodyFont,
  fontSize: '0.875rem',
  width: '75px',
  height: '34px',
  textAlign: 'center',
  color: ({ theme }) => theme.inputTextColor,
  backgroundColor: ({ theme }) => theme.inputBackgroundColor,

  '&[type=number]::-webkit-inner-spin-button': {
    opacity: 1
  },
  '&[type=number]::-webkit-outer-spin-button': {
    opacity: 1
  }
});

export default Input;
