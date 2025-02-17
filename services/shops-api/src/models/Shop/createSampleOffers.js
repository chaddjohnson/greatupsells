const models = require('..');

const createSampleOffers = async (shop) => {
  const [Offer, Product, Theme] = await Promise.all([models.get('Offer'), models.get('Product'), models.get('Theme')]);

  const offerCount = await Offer.countDocuments({ shop: shop._id });

  // Only create sample offers if no offers exists.
  if (offerCount > 0) {
    return;
  }

  const triggerProduct = await Product.findOneRandomByShop(shop);
  const offeredProduct1 = await Product.findOneRandomByShop(shop, {
    excludedShopifyProductIds: [triggerProduct.shopifyProductId]
  });
  const offeredProduct2 = await Product.findOneRandomByShop(shop, {
    excludedShopifyProductIds: [triggerProduct.shopifyProductId, offeredProduct1.shopifyProductId]
  });
  const offeredProduct3 = await Product.findOneRandomByShop(shop, {
    excludedShopifyProductIds: [
      triggerProduct.shopifyProductId,
      offeredProduct1.shopifyProductId,
      offeredProduct2.shopifyProductId
    ]
  });

  // Create copies of themes first
  const theme1 = await Theme.findOne({
    key: 'MultiProductOffer1',
    offer: null
  });
  const theme2 = await Theme.findOne({
    key: 'SingleProductOffer2',
    offer: null
  });
  const theme3 = await Theme.findOne({
    key: 'SingleProductOffer1',
    offer: null
  });
  const theme1Clone = await theme1.clone();
  const theme2Clone = await theme2.clone();
  const theme3Clone = await theme3.clone();
  const theme4Clone = await theme1.clone();

  const offerTemplates = [
    {
      impressionCount: 0,
      acceptanceCount: 0,
      conversionCount: 0,
      conversionRate: 0,
      revenueIncrease: 0,
      viewAllowance: 'PAGE',
      viewAllowanceDays: 7,
      triggerExternalLinksOnly: true,
      triggerScrollThreshold: 75,
      triggerPage: 'ANY',
      minimumRequirement: 'NONE',
      enableBundling: false,
      geotargetingCountries: [],
      performActionOnAdd: false,
      enableVariantSelection: true,
      enableQuantitySelection: true,
      enableEscClose: true,
      enableMaskClose: true,
      enabled: false,
      name: 'Example cross-sell offer',
      strategy: 'CROSS_SELL',
      actionButtonBehavior: 'CHECKOUT',
      offeredProducts: [
        {
          title: offeredProduct1.title,
          handle: offeredProduct1.shopifyProductData.handle,
          imageUrl: offeredProduct1.shopifyProductData.image?.src,
          shopifyProductId: offeredProduct1.shopifyProductId,
          shopifyVariantIds: offeredProduct1.shopifyProductData.variants.map((variant) => variant.id)
        },
        {
          title: offeredProduct2.title,
          handle: offeredProduct2.shopifyProductData.handle,
          imageUrl: offeredProduct2.shopifyProductData.image?.src,
          shopifyProductId: offeredProduct2.shopifyProductId,
          shopifyVariantIds: offeredProduct2.shopifyProductData.variants.map((variant) => variant.id)
        },
        {
          title: offeredProduct3.title,
          handle: offeredProduct3.shopifyProductData.handle,
          imageUrl: offeredProduct3.shopifyProductData.image?.src,
          shopifyProductId: offeredProduct3.shopifyProductId,
          shopifyVariantIds: offeredProduct3.shopifyProductData.variants.map((variant) => variant.id)
        }
      ],
      offeredCollections: [],
      discountType: 'PERCENTAGE',
      discountValue: 1,
      discountTitle: '10% off',
      triggerEvent: 'ADD',
      triggerProducts: [
        {
          title: triggerProduct.title,
          handle: triggerProduct.shopifyProductData.handle,
          imageUrl: triggerProduct.shopifyProductData.image?.src,
          shopifyProductId: triggerProduct.shopifyProductId,
          shopifyVariantIds: triggerProduct.shopifyProductData.variants.map((variant) => variant.id)
        }
      ],
      triggerCollections: [],
      startAt: new Date().toISOString(),
      animation: 'effect-slide-in-scale',
      maximumOfferedProductQuantity: 3,
      actionButtonLinkOpenInNewTab: false,
      shop: shop._id,
      shopifyShopId: shop.shopifyShopId,
      theme: theme1Clone._id
    },
    {
      impressionCount: 0,
      acceptanceCount: 0,
      conversionCount: 0,
      conversionRate: 0,
      revenueIncrease: 0,
      viewAllowance: 'PAGE',
      viewAllowanceDays: 7,
      triggerExternalLinksOnly: true,
      triggerScrollThreshold: 75,
      triggerPage: 'ANY',
      minimumRequirement: 'NONE',
      enableBundling: false,
      geotargetingCountries: [],
      performActionOnAdd: false,
      enableVariantSelection: true,
      enableQuantitySelection: true,
      enableEscClose: true,
      enableMaskClose: true,
      enabled: false,
      name: 'Example exit intent offer',
      strategy: 'CROSS_SELL',
      actionButtonBehavior: 'CHECKOUT',
      offeredProducts: [
        {
          title: offeredProduct1.title,
          handle: offeredProduct1.shopifyProductData.handle,
          imageUrl: offeredProduct1.shopifyProductData.image?.src,
          shopifyProductId: offeredProduct1.shopifyProductId,
          shopifyVariantIds: offeredProduct1.shopifyProductData.variants.map((variant) => variant.id)
        }
      ],
      offeredCollections: [],
      discountType: 'PERCENTAGE',
      discountValue: 0.2,
      discountTitle: '20% off',
      triggerEvent: 'EXIT',
      triggerProducts: [],
      triggerCollections: [],
      startAt: new Date().toISOString(),
      animation: 'effect-sticky-up',
      maximumOfferedProductQuantity: 1,
      actionButtonLinkOpenInNewTab: false,
      shop: shop._id,
      shopifyShopId: shop.shopifyShopId,
      theme: theme2Clone._id
    },
    {
      impressionCount: 0,
      acceptanceCount: 0,
      conversionCount: 0,
      conversionRate: 0,
      revenueIncrease: 0,
      viewAllowance: 'PAGE',
      viewAllowanceDays: 7,
      triggerExternalLinksOnly: true,
      triggerScrollThreshold: 75,
      triggerPage: 'ANY',
      minimumRequirement: 'NONE',
      enableBundling: false,
      geotargetingCountries: [],
      performActionOnAdd: false,
      enableVariantSelection: true,
      enableQuantitySelection: true,
      enableEscClose: true,
      enableMaskClose: true,
      enabled: false,
      name: 'Example buy one get one free offer',
      strategy: 'CROSS_SELL',
      actionButtonBehavior: 'CHECKOUT',
      offeredProducts: [
        {
          title: offeredProduct1.title,
          handle: offeredProduct1.shopifyProductData.handle,
          imageUrl: offeredProduct1.shopifyProductData.image?.src,
          shopifyProductId: offeredProduct1.shopifyProductId,
          shopifyVariantIds: offeredProduct1.shopifyProductData.variants.map((variant) => variant.id)
        }
      ],
      offeredCollections: [],
      discountType: 'PERCENTAGE',
      discountValue: 1,
      discountTitle: 'Buy one get one free',
      triggerEvent: 'ADD',
      triggerProducts: [
        {
          title: triggerProduct.title,
          handle: triggerProduct.shopifyProductData.handle,
          imageUrl: triggerProduct.shopifyProductData.image?.src,
          shopifyProductId: triggerProduct.shopifyProductId,
          shopifyVariantIds: triggerProduct.shopifyProductData.variants.map((variant) => variant.id)
        }
      ],
      triggerCollections: [],
      startAt: new Date(),
      animation: 'effect-slide-in-scale',
      maximumOfferedProductQuantity: 1,
      actionButtonLinkOpenInNewTab: false,
      shop: shop._id,
      shopifyShopId: shop.shopifyShopId,
      theme: theme3Clone._id
    },
    {
      impressionCount: 0,
      acceptanceCount: 0,
      conversionCount: 0,
      conversionRate: 0,
      revenueIncrease: 0,
      viewAllowance: 'PAGE',
      viewAllowanceDays: 7,
      triggerExternalLinksOnly: true,
      triggerScrollThreshold: 75,
      triggerPage: 'PAGE',
      minimumRequirement: 'NONE',
      enableBundling: true,
      geotargetingCountries: [],
      performActionOnAdd: false,
      enableVariantSelection: true,
      enableQuantitySelection: true,
      enableEscClose: true,
      enableMaskClose: true,
      enabled: false,
      name: 'Example bundle offer',
      strategy: 'CROSS_SELL',
      actionButtonBehavior: 'CHECKOUT',
      offeredProducts: [
        {
          title: offeredProduct1.title,
          handle: offeredProduct1.shopifyProductData.handle,
          imageUrl: offeredProduct1.shopifyProductData.image?.src,
          shopifyProductId: offeredProduct1.shopifyProductId,
          shopifyVariantIds: offeredProduct1.shopifyProductData.variants.map((variant) => variant.id)
        },
        {
          title: offeredProduct2.title,
          handle: offeredProduct2.shopifyProductData.handle,
          imageUrl: offeredProduct2.shopifyProductData.image?.src,
          shopifyProductId: offeredProduct2.shopifyProductId,
          shopifyVariantIds: offeredProduct2.shopifyProductData.variants.map((variant) => variant.id)
        },
        {
          title: offeredProduct3.title,
          handle: offeredProduct3.shopifyProductData.handle,
          imageUrl: offeredProduct3.shopifyProductData.image?.src,
          shopifyProductId: offeredProduct3.shopifyProductId,
          shopifyVariantIds: offeredProduct3.shopifyProductData.variants.map((variant) => variant.id)
        }
      ],
      offeredCollections: [],
      discountType: 'PERCENTAGE',
      discountValue: 0.1,
      discountTitle: 'Bundle discount',
      triggerEvent: 'LOAD',
      triggerProducts: [
        {
          title: triggerProduct.title,
          handle: triggerProduct.shopifyProductData.handle,
          imageUrl: triggerProduct.shopifyProductData.image?.src,
          shopifyProductId: triggerProduct.shopifyProductId,
          shopifyVariantIds: triggerProduct.shopifyProductData.variants.map((variant) => variant.id)
        }
      ],
      triggerCollections: [],
      startAt: new Date(),
      animation: 'effect-slide-in-scale',
      maximumOfferedProductQuantity: 3,
      actionButtonLinkOpenInNewTab: false,
      triggerPagePath: '/',
      shop: shop._id,
      shopifyShopId: shop.shopifyShopId,
      theme: theme4Clone._id
    }
  ];

  // Create offers.
  const [offer1, offer2, offer3, offer4] = await Promise.all(
    offerTemplates.map(async (offerTemplate) => {
      return await Offer.create(offerTemplate);
    })
  );

  // Associate offers with themes.
  theme1Clone.offer = offer1._id;
  theme2Clone.offer = offer2._id;
  theme3Clone.offer = offer3._id;
  theme4Clone.offer = offer4._id;

  // Save themes.
  await Promise.all([theme1Clone.save(), theme2Clone.save(), theme3Clone.save(), theme4Clone.save()]);
};

module.exports = createSampleOffers;
