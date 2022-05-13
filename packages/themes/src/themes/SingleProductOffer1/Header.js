import React from 'react';
import { useTheme } from 'styled-components';
import styled from '@greatupsells/styled-with-facepaint';

const Title = styled.h2({
  fontFamily: ({ theme }) => theme.headingFont,
  fontSize: ({ theme }) => `${theme.headingFontSize / 16}rem`,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  lineHeight: 1.2,
  margin: '0 0 17.5px 0',
  color: ({ theme }) => theme.titleTextColor
});

const Header = styled(({ className }) => {
  const theme = useTheme();

  return (
    <header className={className}>
      <Title>{theme.titleText}</Title>
    </header>
  );
})({
  borderBottom: '1px solid #eee',
  marginBottom: '18px',
  maxWidth: '450px',
  margin: 'auto'
});

export default Header;
