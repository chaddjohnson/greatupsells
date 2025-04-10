import React from 'react';
import { ThemeProvider } from 'styled-components';
import { StateContext, Head } from '../../components';
import Container from './Container';
import Header from './Header';
import Body from './Body';
import TriggerProduct from './TriggerProduct';
import OfferedProducts from './OfferedProducts';
import OfferedProduct from './OfferedProduct';
import Footer from './Footer';

const MultiProductOffer2 = ({ context, theme, state }) => {
  const { offeredProducts } = state;

  return (
    <ThemeProvider theme={theme}>
      <StateContext.Provider value={state}>
        <Head context={context}>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet" />
        </Head>
        <Container>
          <Header />
          <Body>
            <TriggerProduct />
            <OfferedProducts>
              {offeredProducts.map((offeredProduct, index) => (
                <OfferedProduct key={index} offeredProduct={offeredProduct} index={index} />
              ))}
            </OfferedProducts>
          </Body>
          <Footer />
        </Container>
      </StateContext.Provider>
    </ThemeProvider>
  );
};

export default MultiProductOffer2;
