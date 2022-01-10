import { useState } from 'react';
import useOfferAcceptances from './offerAcceptances';
import useOfferConversionRates from './offerConversionRates';
import useOfferConversions from './offerConversions';
import useOfferRevenueIncreases from './offerRevenueIncreases';
import useOfferImpressions from './offerImpressions';

const useOfferAnalytics = (offerId, startAt, endAt) => {
  const [offerAnalyticsLoaded, setOfferAnalyticsLoaded] = useState(false);

  const {
    offerAcceptances,
    offerAcceptancesLoading,
    offerAcceptancesError,
    fetchOfferAcceptances
  } = useOfferAcceptances(offerId, startAt, endAt);
  const {
    offerConversions,
    offerConversionsLoading,
    offerConversionsError,
    fetchOfferConversions
  } = useOfferConversions(offerId, startAt, endAt);
  const {
    offerConversionRates,
    offerConversionRatesLoading,
    offerConversionRatesError,
    fetchOfferConversionRates
  } = useOfferConversionRates(offerId, startAt, endAt);
  const {
    offerRevenueIncreases,
    offerRevenueIncreasesLoading,
    offerRevenueIncreasesError,
    fetchOfferRevenueIncreases
  } = useOfferRevenueIncreases(offerId, startAt, endAt);
  const {
    offerImpressions,
    offerImpressionsLoading,
    offerImpressionsError,
    fetchOfferImpressions
  } = useOfferImpressions(offerId, startAt, endAt);

  const offerAnalyticsLoading =
    offerAcceptancesLoading ||
    offerConversionsLoading ||
    offerConversionRatesLoading ||
    offerRevenueIncreasesLoading ||
    offerImpressionsLoading;

  const offerAnalyticsError =
    offerAcceptancesError ||
    offerConversionsError ||
    offerConversionRatesError ||
    offerRevenueIncreasesError ||
    offerImpressionsError;

  const fetchOfferAnalytics = async () => {
    return await Promise.all([
      fetchOfferAcceptances(),
      fetchOfferConversions(),
      fetchOfferConversionRates(),
      fetchOfferRevenueIncreases(),
      fetchOfferImpressions()
    ]);
  };

  if (!offerAnalyticsLoaded && !offerAnalyticsLoading) {
    setOfferAnalyticsLoaded(true);
  }

  return {
    offerAcceptances,
    offerConversions,
    offerConversionRates,
    offerRevenueIncreases,
    offerImpressions,
    offerAnalyticsLoading,
    offerAnalyticsLoaded,
    offerAnalyticsError,
    fetchOfferAnalytics
  };
};

export default useOfferAnalytics;
