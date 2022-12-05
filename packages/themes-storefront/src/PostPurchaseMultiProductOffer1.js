import React from 'react';
import {
  BlockStack,
  InlineStack,
  Button,
  Banner,
  CalloutBanner,
  Heading,
  Image,
  Separator,
  Layout,
  Text,
  TextBlock,
  TextContainer,
  Select,
  Tiles,
  View
} from '@shopify/post-purchase-ui-extensions-react';
import PostPurchaseMultiProductOffer1 from '@greatupsells/themes/PostPurchaseMultiProductOffer1';

const components = {
  BlockStack,
  InlineStack,
  Button,
  Banner,
  CalloutBanner,
  Heading,
  Image,
  Separator,
  Layout,
  Text,
  TextBlock,
  TextContainer,
  Select,
  Tiles,
  View
};

export default (props) => (
  <PostPurchaseMultiProductOffer1 components={components} {...props} />
);
