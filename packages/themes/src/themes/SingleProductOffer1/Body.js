import React from 'react';
import styled from '@greatupsells/styled-with-facepaint';

const Body = styled.section({
  maxWidth: '450px',
  margin: 'auto',
  paddingTop: '0.5rem',
  paddingBottom: '1rem',

  '& a': {
    color: ({ theme }) => theme.bodyTextColor,
    textDecoration: 'none'
  },
  '& img': {
    border: 'none'
  }
});

export default Body;
