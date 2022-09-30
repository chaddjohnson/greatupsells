import React from 'react';
import {
  BlockStack,
  Button,
  CalloutBanner,
  Heading,
  Image,
  Separator,
  Layout,
  Text,
  TextBlock,
  TextContainer,
  Tiles,
  Select,
  View
} from '@shopify/post-purchase-ui-extensions-react';
import PostPurchaseOffer1 from '@greatupsells/themes/PostPurchaseOffer1';

const components = {
  BlockStack,
  Button,
  CalloutBanner,
  Heading,
  Image,
  Separator,
  Layout,
  Text,
  TextBlock,
  TextContainer,
  Tiles,
  Select,
  View
};

export default (props) => (
  <PostPurchaseOffer1 components={components} {...props} />
);
