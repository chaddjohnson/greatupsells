import React, { useContext } from 'react';
import { ComponentContext, ThemeContext } from '../../components';

const Header = () => {
  const { Layout, View, BlockStack, Banner, Text } = useContext(ComponentContext);
  const { bannerTitle, bannerText } = useContext(ThemeContext);

  return (
    <Layout
      maxInlineSize={0.95}
      media={[
        { viewportSize: 'small', sizes: [1] },
        { viewportSize: 'medium', sizes: [600] },
        { viewportSize: 'large', sizes: [850] }
      ]}
    >
      <View blockPadding="loose">
        <BlockStack alignment="center">
          <Text size="xlarge" emphasized>
            {bannerTitle}
          </Text>
        </BlockStack>
        <View blockPadding="tight" />
        <Banner status="critical" iconHidden>
          <BlockStack alignment="center">
            <Text size="large">{bannerText}</Text>
          </BlockStack>
        </Banner>
        <View blockPadding="tight" />
      </View>
    </Layout>
  );
};

export default Header;
