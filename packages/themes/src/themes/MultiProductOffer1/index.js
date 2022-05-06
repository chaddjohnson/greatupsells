import React from 'react';
import { ThemeProvider } from 'styled-components';
import { StateContext, Head } from '../../components';
import Container from './Container';
import Header from './Header';
import Body from './Body';
import CloseButton from './CloseButton';
import Divider from './Divider';
import TriggerProduct from './TriggerProduct';
import OfferedProducts from './OfferedProducts';
import OfferedProduct from './OfferedProduct';
import Footer from './Footer';

const MultiProductOffer1 = ({ context, theme, state }) => {
  const { strategy, triggerProduct, offeredProducts, enableBundling } = state;
  const showTriggerProduct =
    (strategy === 'UPSELL' || theme.showTriggerProduct) && triggerProduct;

  return (
    <ThemeProvider theme={theme}>
      <StateContext.Provider value={state}>
        <Head context={context}>
          <link
            href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600&display=swap"
            rel="stylesheet"
          />
        </Head>
        <Container>
          <CloseButton />
          <Header />
          <Body>
            <>
              {showTriggerProduct && (
                <>
                  <TriggerProduct />
                  <Divider />
                </>
              )}
              <OfferedProducts>
                {offeredProducts.map((offeredProduct, index) => (
                  <OfferedProduct
                    key={index}
                    offeredProduct={offeredProduct}
                    index={index}
                  />
                ))}
              </OfferedProducts>
            </>
          </Body>
          {enableBundling && <Footer />}
        </Container>
      </StateContext.Provider>
    </ThemeProvider>
  );
};

export default MultiProductOffer1;
