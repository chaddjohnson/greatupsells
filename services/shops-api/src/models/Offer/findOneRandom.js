const mongoose = require('mongoose');
const geoip = require('geoip-country');
const globToRegExp = require('glob-to-regexp');
const models = require('..');

const buildViewAllowanceCriteria = (
  offerImpressions,
  sessionOfferImpressions
) => ({
  $or: [
    // Where customers may view the offer every n days, and the customer
    // has not viewed the offer.
    {
      _id: {
        $nin: offerImpressions.map(({ offerId }) =>
          mongoose.Types.ObjectId(offerId)
        )
      },
      viewAllowance: 'DAYS'
    },

    // Where customers may view the offev every n days, and the customer
    // viewed the offer more than n days ago.
    ...offerImpressions.map(({ offerId, viewedAt }) => ({
      _id: mongoose.Types.ObjectId(offerId),
      viewAllowance: 'DAYS',
      viewAllowanceDays: {
        $lte: Math.floor(
          (new Date() - new Date(viewedAt)) / (1000 * 60 * 60 * 24)
        )
      }
    })),

    // Where customers may view the offer with every page load.
    {
      viewAllowance: 'PAGE'
    },

    // Where customers may view the offer once per browser tab session.
    {
      _id: {
        $nin: sessionOfferImpressions.map(({ offerId }) =>
          mongoose.Types.ObjectId(offerId)
        )
      },
      viewAllowance: 'SESSION'
    },

    // Where customers may view the offer only once.
    {
      _id: {
        $nin: offerImpressions.map(({ offerId }) =>
          mongoose.Types.ObjectId(offerId)
        )
      },
      viewAllowance: 'ONCE'
    }
  ]
});

const buildMinimumRequirementCriteria = (
  shopifyCartTotal,
  shopifyCartItemCount
) => ({
  $or: [
    { minimumRequirement: 'NONE' },
    {
      minimumRequirement: 'AMOUNT',
      minimumRequiredAmount: { $lte: shopifyCartTotal }
    },
    {
      minimumRequirement: 'QUANTITY',
      minimumRequiredAmount: { $lte: shopifyCartItemCount }
    }
  ]
});

const buildDateCriteria = () => ({
  $or: [
    {
      startAt: null,
      endAt: null
    },
    {
      startAt: { $lte: new Date() },
      $or: [{ endAt: null }, { endAt: { $gte: new Date() } }]
    }
  ]
});

const buildProductsCriteria = async (shopifyProductIds, shopifyVariantIds) => {
  const Collection = await models.get('Collection');

  // Find collections containing one or more of the products.
  const collections = await Collection.find({
    shopifyProductIds: { $in: shopifyProductIds }
  });
  const shopifyCollectionIds = collections.map(
    ({ shopifyCollectionId }) => shopifyCollectionId
  );

  // An upsell offer requires a specific trigger product.
  const upsellCriteria = {
    strategy: 'UPSELL',
    'triggerProducts.shopifyVariantIds': {
      $in: shopifyVariantIds
    }
  };

  const nonUpsellCriteria = {
    strategy: { $ne: 'UPSELL' },
    $or: [
      {
        'triggerProducts.shopifyVariantIds': {
          $in: shopifyVariantIds
        }
      },
      {
        'triggerCollections.shopifyCollectionId': {
          $in: shopifyCollectionIds
        }
      },
      {
        triggerProducts: { $size: 0 },
        triggerCollections: { $size: 0 }
      }
    ]
  };

  return { $or: [upsellCriteria, nonUpsellCriteria] };
};

const buildGeotargetingCriteria = (countryCode) => ({
  $or: [
    { geotargetingCountries: { $size: 0 } },
    { geotargetingCountries: countryCode }
  ]
});

// This removes leading slashes (and re-adds one), trailing slashes, and query strings.
const sanitizePagePath = (pagePath) => {
  return pagePath && `/${pagePath.replace(/(^\/*|\/*$|\/*?\?.*)/g, '')}`;
};

const getShopifyCartDataFromShopifyOrder = async (shop, shopifyOrderId) => {
  // Query Shopify for order data because the order may have just been created.
  const shopifyApiClient = shop.getShopifyApiClient();
  const shopifyOrderData = await shopifyApiClient.order.get(shopifyOrderId);
  const {
    line_items: lineItems = [],
    subtotal_price: subtotalPrice = 0
  } = shopifyOrderData;
  const shopifyProductIds = lineItems.map((item) => item.product_id);
  const shopifyVariantIds = lineItems.map((item) => item.variant_id);
  const shopifyCartTotal = parseFloat(subtotalPrice) || 0;
  const shopifyCartItemCount = lineItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return {
    shopifyProductIds,
    shopifyVariantIds,
    shopifyCartTotal,
    shopifyCartItemCount
  };
};

const buildCriteria = async (
  shop,
  {
    triggerEvent,
    shopifyProductIds = [],
    shopifyVariantIds = [],
    shopifyCartTotal = 0,
    shopifyCartItemCount = 0,
    shopifyOrderId = undefined,
    ipAddress = undefined,
    offerImpressions = [],
    sessionOfferImpressions = []
  }
) => {
  const isLocalIpAddress = !!ipAddress && ipAddress === '127.0.0.1';
  const geoData = !!ipAddress && !isLocalIpAddress && geoip.lookup(ipAddress);
  let shopifyOrderCartData = null;

  if (shopifyOrderId) {
    shopifyOrderCartData = await getShopifyCartDataFromShopifyOrder(
      shop,
      shopifyOrderId
    );

    // Prioritize using order data over provided data.
    shopifyProductIds = shopifyOrderCartData.shopifyProductIds;
    shopifyVariantIds = shopifyOrderCartData.shopifyVariantIds;
    shopifyCartTotal = shopifyOrderCartData.shopifyCartTotal;
    shopifyCartItemCount = shopifyOrderCartData.shopifyCartItemCount;
  }

  const criteria = {
    shop: shop._id,
    triggerEvent,
    enabled: true,
    $and: [
      buildViewAllowanceCriteria(offerImpressions, sessionOfferImpressions),
      buildMinimumRequirementCriteria(shopifyCartTotal, shopifyCartItemCount),
      buildDateCriteria()
    ]
  };

  // Ensure Shopify IDs are numeric prior to querying.
  shopifyProductIds = shopifyProductIds?.map((shopifyProductId) =>
    parseInt(shopifyProductId)
  );
  shopifyVariantIds = shopifyVariantIds?.map((shopifyVariantId) =>
    parseInt(shopifyVariantId)
  );

  criteria.$and.push(
    await buildProductsCriteria(shopifyProductIds, shopifyVariantIds)
  );

  // Limit to offers with no geotargeting AND offers targeting the country that
  // the IP address resolves to.
  if (geoData && geoData.country) {
    criteria.$and.push(buildGeotargetingCriteria(geoData.country));
  }

  return criteria;
};

const findOneRandom = async (
  shop,
  {
    triggerEvent,
    shopifyProductIds = [],
    shopifyVariantIds = [],
    shopifyCartTotal = 0,
    shopifyCartItemCount = 0,
    shopifyOrderId = undefined,
    ipAddress = undefined,
    offerImpressions = [],
    sessionOfferImpressions = [],
    pagePath
  }
) => {
  const shopifyProductIdsRequired = triggerEvent === 'ADD';
  const shopifyProductIdsMissing =
    !shopifyProductIds || shopifyProductIds.length === 0;

  if (!triggerEvent) {
    throw new Error('`triggerEvent` must be provided');
  }
  if (shopifyProductIdsRequired && shopifyProductIdsMissing) {
    throw new Error(
      `\`shopifyProductIds\` must be provided with trigger event ${triggerEvent}`
    );
  }

  // Disallow showing offers if the shop is not active.
  if (!shop.active) {
    return;
  }

  // Disallow showing offers if the shop plan is not active.
  if (!shop.plan.active) {
    return;
  }

  // Disallow showing offers if upsell revenue has reached the tier max for the period.
  if (
    shop.plan.monthUpsellRevenueLimit &&
    shop.plan.monthUpsellRevenue >= shop.plan.monthUpsellRevenueLimit
  ) {
    return;
  }

  const [Offer] = await Promise.all([
    models.get('Offer'),
    models.get('Collection')
  ]);
  const criteria = await buildCriteria(shop, {
    triggerEvent,
    shopifyProductIds,
    shopifyVariantIds,
    shopifyCartTotal,
    shopifyCartItemCount,
    shopifyOrderId,
    ipAddress,
    offerImpressions,
    sessionOfferImpressions
  });
  const pagePathSanitized = sanitizePagePath(pagePath);
  const isThankYouPage = !!pagePath.match(/\/checkouts\/[^\/]+\/thank_you/);

  // Find an offer.
  let offers = await Offer.find(criteria);

  offers = offers.filter((offer) => {
    // Filter for offers targeting the Order Status page if that is the current page.
    if (offer.strategy === 'THANK_YOU_PAGE') {
      return isThankYouPage;
    }

    // Include the offer if there is no trigger page to filter for.
    if (offer.triggerPage !== 'PAGE') {
      return true;
    }

    // Match home page with or without locale prefix.
    if (offer.triggerPagePath === '/') {
      return pagePathSanitized.match(/^(?:\/[a-z]{2}-[a-z]{2})?\/?$/);
    }

    // Filter trigger path based on regex if trigger page is a specific page.
    return (
      offer.triggerPagePath &&
      pagePathSanitized.match(
        globToRegExp(offer.triggerPagePath, {
          extended: true,
          globstar: false
        })
      )
    );
  });

  // Return a random offer from the found offers.
  return offers[Math.floor(Math.random() * offers.length)];
};

module.exports = findOneRandom;
