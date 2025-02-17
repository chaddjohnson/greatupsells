import React from 'react';
import { useTheme } from 'styled-components';
import styled from '@greatupsells/styled-with-facepaint';
import CloseButton from './CloseButton';

const Heading1 = styled.div({
  fontSize: '1.09375rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  color: ({ theme }) => theme.heading1Color,
  marginBottom: '0.75rem'
});

const Heading2 = styled.div({
  fontWeight: 700,
  fontSize: '1.64rem',
  color: ({ theme }) => theme.heading2Color,
  marginTop: '0.75rem'
});

const Header = styled(({ className }) => {
  const { heading1, heading2 } = useTheme();

  return (
    <header className={className}>
      <CloseButton />
      <Heading1>{heading1}</Heading1>
      <Heading2>{heading2}</Heading2>
    </header>
  );
})({
  textAlign: 'center',
  maxWidth: '550px',
  margin: '0 auto',
  marginBottom: [({ theme }) => (theme.enableBundling ? '1.5rem' : '1.25rem'), '1.25rem', '1.25rem', '1.25rem'],
  paddingLeft: ['1rem', '1rem', 0, 0],
  paddingRight: ['1rem', '1rem', 0, 0]
});

export default Header;
