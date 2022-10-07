import React, { useContext, useMemo } from 'react';
import { ComponentContext, StateContext, ThemeContext } from '../../components';
import PriceHeader from './PriceHeader';

const OfferedProduct = ({ offeredProduct, index }) => {
  const { BlockStack, Button, Image, Text, Select, Tiles, View } = useContext(
    ComponentContext
  );
  const {
    selectedVariants,
    selectedQuantities,
    maxQuantities,
    totalPrices,
    totalPricesFormatted,
    pricesLoading,
    addingProduct,
    addedQuantities,
    handleVariantChange,
    handleQuantityChange,
    handleAddProduct
  } = useContext(StateContext);
  const { showOriginalPrice, showVariantThumbnails } = useContext(ThemeContext);

  const { variants } = offeredProduct;
  const selectedVariant = selectedVariants[index];
  const addingAnyProduct = addingProduct.some((adding) => !!adding);
  const addedAnyProduct = addedQuantities.some((quantity) => quantity > 0);

  const savings = useMemo(
    () =>
      Math.round((1 - selectedVariant.salePrice / selectedVariant.price) * 100),
    [selectedVariant.price, selectedVariant.salePrice]
  );

  return (
    <BlockStack key={index} spacing="xtight">
      <Tiles maxPerLine={2} breakAt={375} spacing="loose">
        <View>
          <View>
            <Image
              aspectRatio="1"
              fit="contain"
              source={selectedVariant.thumbnailImage.src}
              alt={selectedVariant.thumbnailImage.alt}
            />
          </View>
          <View blockPadding="tight" />
          {showVariantThumbnails && variants.length > 0 ? (
            <Tiles maxPerLine={4} spacing="tight">
              {variants.slice(0, 4).map((variant, variantIndex) => (
                <View key={variantIndex}>
                  <Image
                    aspectRatio="1"
                    fit="contain"
                    source={variant.thumbnailImage.src}
                    alt={variant.thumbnailImage.alt}
                  />
                </View>
              ))}
            </Tiles>
          ) : (
            showVariantThumbnails && <View blockPadding="loose" />
          )}
        </View>
        <View>
          <BlockStack>
            <BlockStack spacing="xtight">
              <Text size="xlarge" emphasized>
                {offeredProduct.title.length > 50
                  ? `${offeredProduct.title.substring(0, 50)}…`
                  : offeredProduct.title}
              </Text>
              <PriceHeader
                originalPrice={
                  showOriginalPrice && selectedVariant.priceFormatted
                }
                discountedPrice={selectedVariant.salePriceFormatted}
                savings={savings}
                loading={pricesLoading}
              />
            </BlockStack>
            <View>
              <BlockStack>
                <Select
                  label="Variant"
                  value={selectedVariant.id}
                  options={variants.map((variant) => ({
                    label: variant.title,
                    value: variant.id,
                    disabled: !variant.hasInventory
                  }))}
                  onChange={(value) => handleVariantChange(index, value)}
                />
                <Select
                  label="Quantity"
                  value={selectedQuantities[index]}
                  options={[
                    ...Array(Math.min(maxQuantities[index], 25, 100)).keys()
                  ].map((quantityIndex) => ({
                    label: quantityIndex + 1,
                    value: quantityIndex + 1
                  }))}
                  onChange={(value) => handleQuantityChange(index, value)}
                />
              </BlockStack>
            </View>
          </BlockStack>
        </View>
      </Tiles>
      <View blockPadding="extraTight" />
      <Button
        submit
        loading={addingProduct[index] || pricesLoading}
        disabled={addingAnyProduct || addedAnyProduct}
        onPress={() => handleAddProduct(index)}
      >
        {totalPrices[index] > 0 && <>Pay now • {totalPricesFormatted[index]}</>}
        {totalPrices[index] === 0 && <>Add now • Free</>}
      </Button>
      <View blockPadding="tight" />
    </BlockStack>
  );
};

export default OfferedProduct;
