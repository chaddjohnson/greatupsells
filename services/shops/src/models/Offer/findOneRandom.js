const mongoose = require('mongoose');
const geoip = require('geoip-country');
const globToRegExp = require('glob-to-regexp');
const mongodbClient = require('../mongodbClient');

const buildViewAllowanceCriterias = (
  offerImpressions,
  sessionOfferImpressions
) => [
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
];

const buildProductsCriteria = async (shopifyProductIds) => {
  const Collection = mongodbClient.connection.model('Collection');
  const collections = await Collection.find({
    shopifyProductIds: { $in: shopifyProductIds }
  });
  const shopifyCollectionIds = collections.map(
    ({ shopifyCollectionId }) => shopifyCollectionId
  );

  return [
    {
      'triggerProducts.shopifyProductId': {
        $in: shopifyProductIds
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
  ];
};

const buildGeotargetingCriteria = (countryCode) => [
  {
    enableGeotargeting: false
  },
  {
    geotargetingCountries: countryCode
  }
];

// This removes leading slashes (and re-adds one), trailing slashes, and query strings.
const sanitizePagePath = (pagePath) => {
  return pagePath && `/${pagePath.replace(/(^\/*|\/*$|\/*?\?.*)/g, '')}`;
};

const findOneRandom = async (
  shop,
  {
    triggerEvent,
    shopifyProductIds = [],
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

  const Offer = mongodbClient.connection.model('Offer');
  const isLocalIpAddress = !!ipAddress && ipAddress === '127.0.0.1';
  const geoData = !!ipAddress && !isLocalIpAddress && geoip.lookup(ipAddress);
  const pagePathSanitized = sanitizePagePath(pagePath);

  const criteria = {
    shop: shop._id,
    triggerEvent,
    enabled: true,
    $and: [
      {
        $or: buildViewAllowanceCriterias(
          offerImpressions,
          sessionOfferImpressions
        )
      }
    ]
  };

  // Ensure Shopify product IDs are numeric prior to querying.
  shopifyProductIds =
    shopifyProductIds &&
    shopifyProductIds.map((shopifyProductId) => parseInt(shopifyProductId));

  criteria.$and.push({
    $or: await buildProductsCriteria(shopifyProductIds)
  });

  // Limit to offers with no geotargeting AND offers targeting the country that
  // the IP address resolves to.
  if (geoData && geoData.country) {
    criteria.$and.push({
      $or: buildGeotargetingCriteria(geoData.country)
    });
  }

  // Randomly find an offer.
  let offers = await Offer.find(criteria);

  // Filter trigger path based on regex if trigger page is a specific page.
  offers = offers.filter((offer) => {
    if (offer.triggerPage !== 'PAGE') {
      return true;
    }

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
