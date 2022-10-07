import React, { useMemo } from 'react';
import { ComponentContext, StateContext } from '../../components';
import PriceHeader from './PriceHeader';
import MoneyLine from './MoneyLine';
import MoneySummary from './MoneySummary';

const PostPurchaseSingleProductOffer1 = ({ theme, state, components }) => {
  const {
    BlockStack,
    Button,
    Banner,
    CalloutBanner,
    Heading,
    Image,
    Separator,
    Layout,
    TextBlock,
    TextContainer,
    Text,
    Select,
    View
  } = components;

  const { bannerTitle, bannerText, showOriginalPrice } = theme;
  const {
    offeredProducts,
    selectedVariants,
    selectedQuantities,
    maxQuantities,
    subtotalPricesFormatted,
    shippingPricesFormatted,
    taxPricesFormatted,
    totalPrices,
    totalPricesFormatted,
    pricesLoading,
    pricesError,
    addingProduct,
    handleVariantChange,
    handleQuantityChange,
    handleAddProduct,
    handleClose
  } = state;
  const offeredProduct = offeredProducts[0];
  const { variants } = offeredProduct;
  const selectedVariant = selectedVariants[0];

  // Limit total description character count.
  const descriptionParagraphs = useMemo(() => {
    let descriptionLength = 0;

    // Split paragraphs and remove tags.
    const splitDescriptionParagraphs = offeredProduct.description
      ?.match(/<p>([^<]*?)<\/p>/g)
      ?.map((item) => item.replace(/<[^>]+>/g, '')) || [
      offeredProduct.description
    ];

    return splitDescriptionParagraphs.reduce((paragraphs, paragraph) => {
      if (descriptionLength >= 1000 || paragraphs.length >= 8) {
        return paragraphs;
      }

      descriptionLength += paragraph.length;

      return [...paragraphs, paragraph];
    }, []);
  }, [offeredProduct.description]);

  return (
    <ComponentContext.Provider value={components}>
      <StateContext.Provider value={state}>
        <BlockStack spacing="loose">
          <CalloutBanner>
            <BlockStack spacing="tight">
              <TextContainer>
                <Text size="medium" emphasized>
                  {bannerTitle}
                </Text>
              </TextContainer>
              <TextContainer>{bannerText}</TextContainer>
            </BlockStack>
          </CalloutBanner>
          <Layout
            maxInlineSize={0.95}
            media={[
              { viewportSize: 'small', sizes: [1, 30, 1] },
              { viewportSize: 'medium', sizes: [300, 30, 0.5] },
              { viewportSize: 'large', sizes: [400, 30, 0.33] }
            ]}
          >
            <BlockStack alignment="center">
              <View>
                <Image
                  source={selectedVariant.image.src}
                  alt={selectedVariant.image.alt}
                />
              </View>
              <View />
            </BlockStack>
            <View />
            <BlockStack spacing="extraLoose">
              {pricesError && <Banner status="critical">{pricesError}</Banner>}
              <BlockStack>
                <Heading>{offeredProduct.title}</Heading>
                <PriceHeader
                  originalPrice={
                    showOriginalPrice && selectedVariant.priceFormatted
                  }
                  discountedPrice={selectedVariant.salePriceFormatted}
                  loading={pricesLoading}
                />
                {descriptionParagraphs.map((paragraph, index) => (
                  <TextBlock key={index} subdued>
                    {paragraph}
                  </TextBlock>
                ))}
              </BlockStack>
              <BlockStack>
                <Select
                  label="Variant"
                  value={selectedVariant.id}
                  options={variants.map((variant) => ({
                    label: variant.title,
                    value: variant.id,
                    disabled: !variant.hasInventory
                  }))}
                  onChange={(value) => handleVariantChange(0, value)}
                />
                <Select
                  label="Quantity"
                  value={selectedQuantities[0]}
                  options={[
                    ...Array(Math.min(maxQuantities[0], 25, 100)).keys()
                  ].map((index) => ({
                    label: index + 1,
                    value: index + 1
                  }))}
                  onChange={(value) => handleQuantityChange(0, value)}
                />
              </BlockStack>
              <BlockStack spacing="tight">
                <Separator />
                <MoneyLine
                  label="Subtotal"
                  amount={subtotalPricesFormatted[0]}
                  loading={pricesLoading}
                />
                <MoneyLine
                  label="Shipping"
                  amount={shippingPricesFormatted[0]}
                  loading={pricesLoading}
                />
                <MoneyLine
                  label="Taxes"
                  amount={taxPricesFormatted[0]}
                  loading={pricesLoading}
                />
                <Separator />
                <MoneySummary
                  label="Total"
                  amount={totalPricesFormatted[0]}
                  loading={pricesLoading}
                />
              </BlockStack>
              <Separator />
              <Button
                submit
                loading={addingProduct[0] || pricesLoading}
                disabled={addingProduct[0]}
                onPress={() => handleAddProduct(0)}
              >
                {totalPrices[0] > 0 && <>Pay now • {totalPricesFormatted[0]}</>}
                {totalPrices[0] === 0 && <>Add now • Free</>}
              </Button>
              <Button subdued onPress={handleClose}>
                Decline this offer
              </Button>
            </BlockStack>
          </Layout>
        </BlockStack>
      </StateContext.Provider>
    </ComponentContext.Provider>
  );
};

export default PostPurchaseSingleProductOffer1;
