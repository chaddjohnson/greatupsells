import React from 'react';
import { ComponentContext, StateContext, ThemeContext } from '../../components';
import Header from './Header';
import OfferedProduct from './OfferedProduct';

const PostPurchaseMultiProductOffer1 = ({ theme, state, components }) => {
  const { BlockStack, Button, Layout, Tiles, View } = components;
  const { offeredProducts, handleClose } = state;

  return (
    <ComponentContext.Provider value={components}>
      <StateContext.Provider value={state}>
        <ThemeContext.Provider value={theme}>
          <Header />
          <Layout
            maxInlineSize={0.95}
            media={[
              { viewportSize: 'small', sizes: [1] },
              { viewportSize: 'medium', sizes: [600] },
              { viewportSize: 'large', sizes: [850] }
            ]}
          >
            <Tiles maxPerLine={2} breakAt={600} spacing="xloose" alignment="trailing">
              {offeredProducts.map((offeredProduct, index) => (
                <OfferedProduct key={index} offeredProduct={offeredProduct} index={index} />
              ))}
            </Tiles>
          </Layout>
          <Layout
            maxInlineSize={0.95}
            media={[
              { viewportSize: 'small', sizes: [1] },
              { viewportSize: 'medium', sizes: [600] },
              { viewportSize: 'large', sizes: [850] }
            ]}
          >
            <BlockStack>
              <View blockPadding="base" />
              <Button subdued onPress={handleClose}>
                Decline this offer
              </Button>
            </BlockStack>
          </Layout>
        </ThemeContext.Provider>
      </StateContext.Provider>
    </ComponentContext.Provider>
  );
};

export default PostPurchaseMultiProductOffer1;
