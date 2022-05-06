import React from 'react';
import styled from '@greatupsells/styled-with-facepaint';

const OfferedProducts = styled.div({
  display: 'flex',
  flexDirection: ['row', 'column', 'column', 'column'],
  justifyContent: 'space-around',
  marginTop: '1rem',
  width: '100%',
  overflowX: 'auto',

  select: {
    width: '150px',
    marginBottom: ['0.5rem', 0, 0, 0],
    marginTop: ({ theme }) => (theme.showPrices ? '0.75rem' : 0)
  },
  input: {
    width: '75px',
    textAlign: 'center'
  }
});

export default OfferedProducts;
