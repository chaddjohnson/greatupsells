import React from 'react';
import styled from '@greatupsells/styled-with-facepaint';

const Divider = styled.hr({
  display: [
    ({ theme }) => (theme.enableBundling ? 'none' : 'block'),
    'block',
    'block',
    'block'
  ],
  borderTop: [
    'none',
    '1px solid #C0C0C0',
    '1px solid #C0C0C0',
    '1px solid #C0C0C0'
  ],
  borderBottom: 'none'
});

export default Divider;
