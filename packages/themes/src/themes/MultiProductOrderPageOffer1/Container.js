import React from 'react';
import styled from '@greatupsells/styled-with-facepaint';

const Container = styled.div({
  backgroundColor: ({ theme }) => theme.popupBackgroundColor,
  maxWidth: '570px',
  maxHeight: '600px',
  overflowX: 'auto',
  margin: 'auto',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
  fontSize: '14px',
  boxSizing: 'border-box',

  '& *': {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
    fontSize: '14px',
    boxSizing: 'border-box'
  }
});

export default Container;
