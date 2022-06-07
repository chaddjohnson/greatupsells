import React from 'react';
import { ThemeProvider } from 'styled-components';
import { StateContext, Head } from '../../components';
import Container from './Container';
import InnerContainer from './InnerContainer';
import CloseButton from './CloseButton';
import Header from './Header';
import Body from './Body';
import Products from './Products';
import TriggerProduct from './TriggerProduct';
import UpgradeArrowIcon from './UpgradeArrowIcon';
import OfferedProduct from './OfferedProduct';
import ProductOptions from './ProductOptions';
import Actions from './Actions';

const SingleProductOffer1 = ({ context, theme, state }) => {
  const { strategy, triggerProduct } = state;
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
          <InnerContainer>
            <Header />
            <Body>
              <Products>
                {showTriggerProduct && (
                  <>
                    <TriggerProduct />
                    <UpgradeArrowIcon />
                  </>
                )}
                <OfferedProduct />
              </Products>
              <ProductOptions />
            </Body>
            <Actions />
          </InnerContainer>
        </Container>
      </StateContext.Provider>
    </ThemeProvider>
  );
};

export default SingleProductOffer1;
