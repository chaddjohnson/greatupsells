import React from 'react';
import { ThemeProvider } from 'styled-components';
import { StateContext, Head } from '../../components';
import Container from './Container';

const MultiProductOffer3 = ({ context, theme, state }) => {
  //

  return (
    <ThemeProvider theme={theme}>
      <StateContext.Provider value={state}>
        <Head context={context}>{/*  */}</Head>
        <Container>{/*  */}</Container>
      </StateContext.Provider>
    </ThemeProvider>
  );
};

export default MultiProductOffer3;
