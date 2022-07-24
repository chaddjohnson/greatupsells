import React from 'react';
import {
  BlockStack,
  Button,
  CalloutBanner,
  Heading,
  Image,
  Separator,
  Layout,
  TextBlock,
  TextContainer,
  Select,
  View
} from '@shopify/post-purchase-ui-extensions-react/build/node';
import { StateContext } from '../../components';

const PostCheckoutOffer1 = ({ state }) => {
  // TODO

  const { selectedVariants } = state;
  const selectedVariant = selectedVariants[0];

  return (
    <StateContext.Provider value={state}>
      <BlockStack spacing="loose">
        <CalloutBanner title="Post-purchase extension template">
          Use this template as a starting point to build a great post-purchase
          extension.
        </CalloutBanner>
        <Layout
          maxInlineSize={0.95}
          media={[
            { viewportSize: 'small', sizes: [1, 30, 1] },
            { viewportSize: 'medium', sizes: [300, 30, 0.5] },
            { viewportSize: 'large', sizes: [400, 30, 0.33] }
          ]}
        >
          <View>
            <Image
              source={selectedVariant.image.src}
              alt={selectedVariant.image.alt}
            />
          </View>
          <View />
          <BlockStack spacing="extraLoose">
            <TextContainer>
              <Heading>Better Shoes</Heading>
              <TextBlock>
                Duis sit nostrud nostrud cillum. Non excepteur nulla culpa
                incididunt irure eu ex eu velit sint excepteur.
              </TextBlock>
              <TextBlock>
                Proident labore officia mollit anim aliquip incididunt fugiat.
              </TextBlock>
            </TextContainer>
            <BlockStack spacing="extraTight">
              <Select
                label="Variant"
                options={[
                  {
                    value: '1',
                    label: 'Australia'
                  },
                  {
                    value: '2',
                    label: 'Canada'
                  },
                  {
                    value: '3',
                    label: 'France'
                  },
                  {
                    value: '4',
                    label: 'Japan'
                  },
                  {
                    value: '5',
                    label: 'Nigeria'
                  },
                  {
                    value: '6',
                    label: 'United States'
                  }
                ]}
              />
              <Select
                label="Quantity"
                value="1"
                options={[...Array(Math.min(25, 100)).keys()].map((index) => ({
                  label: index + 1,
                  value: index + 1
                }))}
              />
            </BlockStack>
            <Separator />
            <Button
              submit
              onPress={() => {
                // eslint-disable-next-line no-console
                console.log('Add button clicked');
              }}
            >
              Add to cart
            </Button>
            <Button
              subdued
              onPress={() => {
                // eslint-disable-next-line no-console
                console.log('Skip button clicked');
              }}
            >
              Skip this offer
            </Button>
          </BlockStack>
        </Layout>
      </BlockStack>
    </StateContext.Provider>
  );
};

export default PostCheckoutOffer1;
