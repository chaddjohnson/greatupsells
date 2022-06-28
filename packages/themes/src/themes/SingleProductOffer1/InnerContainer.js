import React from 'react';
import styled from '@greatupsells/styled-with-facepaint';

const InnerContainer = styled.div({
  overflowX: 'hidden',
  overflowY: 'auto',
  height: 'auto',
  maxHeight: 'calc(100vh - 5rem)',
  padding: ['1.5rem', '2.5rem', '2.5rem', '2.5rem'],

  '@media (max-width: 1023px) and (orientation: landscape)': {
    maxHeight: 'calc(100vh - 1.5rem)'
  }
});

export default InnerContainer;
