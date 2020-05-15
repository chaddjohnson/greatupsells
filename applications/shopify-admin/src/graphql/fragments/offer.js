import { gql } from 'apollo-boost';

export default gql`
  fragment OfferFragment on Offer {
    _id
    platformShopId
    name
    strategy
    viewCount
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
    upsellProducts {
      title
      image {
        src
      }
      platformProductId
    }
    upsellProductsQuantity
    upsellCollections {
      title
      image {
        src
      }
      platformCollectionId
    }
    discountType
    # discountAmount
    triggerEvent
    triggerProducts {
      title
      image {
        src
      }
      platformProductId
    }
    triggerCollections {
      title
      image {
        src
      }
      platformCollectionId
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
