export default /* GraphQL */ `
  fragment OfferFragment on Offer {
    _id
    shopifyShopId
    name
    strategy
    viewCount
    acceptanceCount
    conversionCount
    conversionRate
    revenueIncrease
    callToActionText
    successMessageText
    actionButtonText
    cancelButtonText
    actionButtonBehavior
    popupThemeType
    popupThemeTemplateId
    popupTheme {
      callToActionTextColor
      successMessageTextColor
      successMessageBackgroundColor
      actionButtonBackgroundColor
      actionButtonTextColor
      # actionButtonFontFamily
      cancelButtonTextColor
      priceTextColor
      salePriceTextColor
      popupBackgroundColor
      # popupFontFamily
      # notificationBannerBackgroundColor
      # notificationBannerTextColor
    }
    products {
      title
      image {
        src
      }
      shopifyProductId
    }
    minimumProductsQuantity
    collections {
      title
      image {
        src
      }
      shopifyCollectionId
    }
    discountType
    discountAmount
    triggerEvent
    triggerProducts {
      title
      image {
        src
      }
      shopifyProductId
    }
    triggerCollections {
      title
      image {
        src
      }
      shopifyCollectionId
    }
    startAt
    endAt
    enableTimer
    timerText
    timerCountdownStart
    allowWithDiscountCodes
    allowMultipleUpsells
    hideIfItemAdded
    showNotificationBanner
    enableQuantitySelection
    productQuantityLimit
    limitQuantitySelection
    enableProductLinks
    hideOutOfStockProducts
    # discountCodes
    # discountPricingMethod
    enabled
    createdAt
    updatedAt
  }
`;
