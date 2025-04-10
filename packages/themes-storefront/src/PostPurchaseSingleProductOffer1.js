import React from 'react';
import {
  BlockStack,
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
import PostPurchaseSingleProductOffer1 from '@greatupsells/themes/PostPurchaseSingleProductOffer1';

const components = {
  BlockStack,
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

export default (props) => <PostPurchaseSingleProductOffer1 components={components} {...props} />;
