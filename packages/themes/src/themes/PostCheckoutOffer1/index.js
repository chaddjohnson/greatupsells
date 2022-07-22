import React from 'react';
import {
  BlockStack,
  Button,
  CalloutBanner,
  Heading,
  Image,
  Layout,
  TextBlock,
  TextContainer,
  View
} from '@shopify/post-purchase-ui-extensions-react/build/node';

const PostCheckoutOffer1 = () => {
  // TODO

  return (
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
            source="https://cdn.shopify.com/static/images/examples/img-placeholder-1120x1120.png"
            alt="Placeholder"
          />
        </View>
        <View />
        <BlockStack spacing="xloose">
          <TextContainer>
            <Heading>Post-purchase extension</Heading>
            <TextBlock>
              Here you can cross-sell other products, request a product review
              based on a previous purchase, and much more.
            </TextBlock>
          </TextContainer>
          <Button
            submit
            onPress={() => {
              // eslint-disable-next-line no-console
              console.log('Button clicked');
            }}
          >
            Add to cart
          </Button>
        </BlockStack>
      </Layout>
    </BlockStack>
  );
};

export default PostCheckoutOffer1;
