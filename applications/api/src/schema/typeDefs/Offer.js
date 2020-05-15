const { gql } = require('apollo-server-lambda');

const typeDef = gql`
  scalar JSON

  type Offer {
    _id: ID!
    platformShopId: ID!
    name: String!
    shop: Shop
    strategy: OfferStrategy!
    viewCount: Int!
    conversionCount: Int!
    conversionRate: Float!
    revenueIncrease: Float!
    callToActionText: String!
    successMessageText: String!
    actionButtonText: String!
    cancelButtonText: String!
    actionButtonBehavior: OfferActionButtonBehavior!
    popupThemeType: OfferPopupThemeType!
    popupThemeTemplateId: String
    popupTheme: OfferPopupTheme
    upsellProducts: [OfferProduct]
    upsellProductsQuantity: Int
    upsellCollections: [OfferCollection]
    discountType: OfferDiscountType!
    # discountAmount
    triggerEvent: OfferTriggerEvent
    triggerProducts: [OfferProduct]
    triggerCollections: [OfferCollection]
    startAt: String!
    endAt: String
    enableTimer: Boolean
    timerText: String
    timerCountdownStart: Int
    allowWithDiscountCodes: Boolean
    allowMultipleUpsells: Boolean
    hideIfItemAdded: Boolean
    showNotificationBanner: Boolean
    enableQuantitySelection: Boolean
    productQuantityLimit: Int
    limitQuantitySelection: Boolean
    enableProductLinks: Boolean
    hideOutOfStockProducts: Boolean
    # discountCodes
    # discountPricingMethod
    enabled: Boolean
    createdAt: String
    updatedAt: String
  }

  enum OfferStrategy {
    UPSELL
    CROSS_SELL
  }

  enum OfferActionButtonBehavior {
    CART
    CHECKOUT
    PAGE
  }

  enum OfferPopupThemeType {
    TEMPLATE
    CUSTOM
  }

  enum OfferDiscountType {
    PERCENTAGE
    USD
    SET_PRICE
    NO_DISCOUNT
  }

  enum OfferTriggerEvent {
    ADD
    CART
    CHECKOUT
  }

  type OfferProduct {
    title: String!
    image: OfferProductImage
    platformProductId: ID
  }

  type OfferProductImage {
    src: String!
  }

  type OfferCollection {
    title: String!
    image: OfferCollectionImage
    platformCollectionId: ID
  }

  type OfferCollectionImage {
    src: String!
  }

  type OfferPopupTheme {
    callToActionTextColor: String!
    successMessageTextColor: String!
    successMessageBackgroundColor: String!
    actionButtonBackgroundColor: String!
    actionButtonTextColor: String!
    # actionButtonFontFamily: String
    cancelButtonTextColor: String!
    priceTextColor: String!
    salePriceTextColor: String!
    popupBackgroundColor: String!
    # popupFontFamily: String
    # notificationBannerBackgroundColor: String
    # notificationBannerTextColor: String
  }

  input OfferInput {
    name: String!
    strategy: String!
    callToActionText: String!
    successMessageText: String!
    actionButtonText: String!
    cancelButtonText: String!
    actionButtonBehavior: String!
    popupThemeType: String!
    popupThemeTemplateId: String
    popupTheme: OfferPopupThemeInput
    upsellProducts: [OfferProductInput]
    upsellProductsQuantity: Int
    upsellCollections: [OfferCollectionInput]
    discountType: String!
    # discountAmount
    triggerEvent: String
    triggerProducts: [OfferProductInput]
    triggerCollections: [OfferCollectionInput]
    startAt: String!
    endAt: String
    enableTimer: Boolean
    timerText: String
    timerCountdownStart: Int
    allowWithDiscountCodes: Boolean
    allowMultipleUpsells: Boolean
    hideIfItemAdded: Boolean
    showNotificationBanner: Boolean
    enableQuantitySelection: Boolean
    productQuantityLimit: Int
    limitQuantitySelection: Boolean
    enableProductLinks: Boolean
    hideOutOfStockProducts: Boolean
    # discountCodes
    # discountPricingMethod
    enabled: Boolean
  }

  input OfferPopupThemeInput {
    callToActionTextColor: String!
    successMessageTextColor: String!
    successMessageBackgroundColor: String!
    actionButtonBackgroundColor: String!
    actionButtonTextColor: String!
    # actionButtonFontFamily: String
    cancelButtonTextColor: String!
    priceTextColor: String!
    salePriceTextColor: String!
    popupBackgroundColor: String!
    # popupFontFamily: String
    # notificationBannerBackgroundColor: String
    # notificationBannerTextColor: String
  }

  input OfferProductInput {
    title: String!
    image: OfferProductImageInput
    platformProductId: ID
  }

  input OfferCollectionInput {
    title: String!
    image: OfferProductImageInput
    platformCollectionId: ID
  }

  input OfferProductImageInput {
    src: String!
  }
`;

module.exports = typeDef;
