import React from 'react';
import { ThemeProvider } from 'styled-components';
import { StateContext, Head } from '../../components';
import Container from './Container';
import CloseButton from './CloseButton';
import InnerContainer from './InnerContainer';
import Body from './Body';

const SingleProductOffer2 = ({ context, theme, state }) => (
  <ThemeProvider theme={theme}>
    <StateContext.Provider value={state}>
      <Head context={context}>
        <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>
      <Container>
        <CloseButton />
        <InnerContainer>
          <Body />
        </InnerContainer>
      </Container>
    </StateContext.Provider>
  </ThemeProvider>
);

export default SingleProductOffer2;
