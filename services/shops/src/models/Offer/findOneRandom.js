const mongoose = require('mongoose');
const geoip = require('geoip-country');
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

const buildGeotargetingCriteria = (countryCode) => ({
  $or: [{ enableGeotargeting: false }, { geotargetingCountries: countryCode }]
});

const findOneRandomByTriggerEvent = async (
  shop,
  {
    triggerEvent,
    ipAddress = undefined,
    offerImpressions = [],
    sessionOfferImpressions = [],
    pagePath
  }
) => {
  const Offer = mongodbClient.connection.model('Offer');
  const isLocalIpAddress = !!ipAddress && ipAddress === '127.0.0.1';
  const geoData = !!ipAddress && !isLocalIpAddress && geoip.lookup(ipAddress);

  // This removes leading slashes (and re-adds one), trailing slashes, and query strings.
  const pagePathSanitized =
    pagePath && `/${pagePath.replace(/(^\/*|\/*$|\/*?\?.*)/g, '')}`;

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
      },
      {
        $or: [
          {
            triggerEvent: { $ne: 'PAGE' }
          },
          {
            triggerEvent: 'PAGE',
            triggerPagePath: pagePathSanitized
          }
        ]
      }
    ]
  };

  // Limit to offers with no geotargeting AND offers targeting the country that
  // the IP address resolves to.
  if (geoData && geoData.country) {
    criteria.$and.push(buildGeotargetingCriteria(geoData.country));
  }

  // Randomly find an offer having the trigger event as a trigger.
  const randomOffers = await Offer.aggregate([
    { $match: criteria },
    { $sample: { size: 1 } },
    {
      $project: {
        _id: 1
      }
    }
  ]);
  const randomOffer = randomOffers[0];

  if (!randomOffer || !randomOffer._id) {
    return;
  }

  // Aggregation only returns JSON, so query for a Mongoose document.
  return await Offer.findById(randomOffer._id);
};

const findOneRandomByTriggerEventAndShopifyProductIds = async (
  shop,
  {
    triggerEvent,
    shopifyProductIds,
    ipAddress = undefined,
    offerImpressions = [],
    sessionOfferImpressions = []
  }
) => {
  shopifyProductIds = shopifyProductIds.map((shopifyProductId) =>
    parseInt(shopifyProductId)
  );

  const Collection = mongodbClient.connection.model('Collection');
  const Offer = mongodbClient.connection.model('Offer');
  const isLocalIpAddress = !!ipAddress && ipAddress === '127.0.0.1';
  const geoData = !!ipAddress && !isLocalIpAddress && geoip.lookup(ipAddress);
  const collections = await Collection.find({
    shopifyProductIds: { $in: shopifyProductIds }
  });
  const shopifyCollectionIds = collections.map(
    ({ shopifyCollectionId }) => shopifyCollectionId
  );

  const criteria = {
    shop: shop._id,
    triggerEvent,
    enabled: true,
    $and: [
      {
        $or: [
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
        ]
      },
      {
        $or: buildViewAllowanceCriterias(
          offerImpressions,
          sessionOfferImpressions
        )
      }
    ]
  };

  // Limit to offers with no geotargeting AND offers targeting the country that
  // the IP address resolves to.
  if (geoData && geoData.country) {
    criteria.$and.push(buildGeotargetingCriteria(geoData.country));
  }

  // Randomly select an offer having the trigger event as a trigger AND [one of
  // the Shopify products as a trigger OR a collection to which one or more
  // of the products belong as a trigger].
  const randomOffers = await Offer.aggregate([
    { $match: criteria },
    { $sample: { size: 1 } },
    {
      $project: {
        _id: 1
      }
    }
  ]);
  const randomOffer = randomOffers[0];

  if (!randomOffer || !randomOffer._id) {
    return;
  }

  // Aggregation only returns JSON, so query for a Mongoose document.
  return await Offer.findById(randomOffer._id);
};

const findOneRandom = async (
  shop,
  {
    triggerEvent,
    shopifyProductIds,
    ipAddress,
    offerImpressions,
    sessionOfferImpressions,
    pagePath
  }
) => {
  const shopifyProductIdsRequired = triggerEvent === 'ADD';
  const shopifyProductIdsMissing =
    !shopifyProductIds || shopifyProductIds.length === 0;

  if (!shop) {
    throw new Error('`shop` must be provided');
  }
  if (!triggerEvent) {
    throw new Error('`triggerEvent` must be provided');
  }
  if (shopifyProductIdsRequired && shopifyProductIdsMissing) {
    throw new Error(
      `\`shopifyProductIds\` must be provided with trigger event ${triggerEvent}`
    );
  }

  if (!shopifyProductIdsMissing || triggerEvent === 'CART') {
    return await findOneRandomByTriggerEventAndShopifyProductIds(shop, {
      triggerEvent,
      shopifyProductIds,
      ipAddress,
      offerImpressions,
      sessionOfferImpressions
    });
  } else {
    return await findOneRandomByTriggerEvent(shop, {
      triggerEvent,
      ipAddress,
      offerImpressions,
      sessionOfferImpressions,
      pagePath
    });
  }
};

module.exports = findOneRandom;
