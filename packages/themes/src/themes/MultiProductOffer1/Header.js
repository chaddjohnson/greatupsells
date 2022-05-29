import React from 'react';
import { useTheme } from 'styled-components';
import styled from '@greatupsells/styled-with-facepaint';

const Title = styled.div({
  fontSize: '1.625rem',
  fontWeight: 600,
  marginBottom: ['1rem', '1.5rem', '1.5rem', '1.5rem']
});

const Content = styled.div({
  fontSize: ['1rem', '1.125rem', '1.125rem', '1.125rem'],
  marginTop: '0.75rem',
  marginBottom: '0.75rem',
  lineHeight: 1.5
});

const Header = styled(({ className }) => {
  const theme = useTheme();

  return (
    <header className={className}>
      <Title>{theme.titleText}</Title>
      <Content>{theme.contentText}</Content>
    </header>
  );
})({
  maxWidth: '550px',
  margin: '0 auto',
  paddingLeft: ['1rem', '1rem', 0, 0],
  paddingRight: ['1rem', '1rem', 0, 0]
});

export default Header;
