import React from 'react';
import { ThemeProvider } from 'styled-components';
import { StateContext } from '../../components';
import Container from './Container';
import Body from './Body';
import OfferedProducts from './OfferedProducts';
import OfferedProduct from './OfferedProduct';
import Footer from './Footer';

const MultiProductOrderPageOffer1 = ({ theme, state }) => {
  const { offeredProducts } = state;

  return (
    <ThemeProvider theme={theme}>
      <StateContext.Provider value={state}>
        <Container>
          <Body>
            <OfferedProducts>
              {offeredProducts.map((offeredProduct, index) => (
                <OfferedProduct
                  key={index}
                  offeredProduct={offeredProduct}
                  index={index}
                />
              ))}
            </OfferedProducts>
          </Body>
          <Footer />
        </Container>
      </StateContext.Provider>
    </ThemeProvider>
  );
};

export default MultiProductOrderPageOffer1;
