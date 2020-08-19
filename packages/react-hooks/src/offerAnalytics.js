import useOfferAcceptances from './offerAcceptances';
import useOfferConversionRates from './offerConversionRates';
import useOfferConversions from './offerConversions';
import useOfferRevenueIncreases from './offerRevenueIncreases';
import useOfferViews from './offerViews';

const useOfferAnalytics = (offerId, startAt, endAt) => {
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
    offerViews,
    offerViewsLoading,
    offerViewsError,
    fetchOfferViews
  } = useOfferViews(offerId, startAt, endAt);

  const offerAnalyticsLoading =
    offerAcceptancesLoading ||
    offerConversionsLoading ||
    offerConversionRatesLoading ||
    offerRevenueIncreasesLoading ||
    offerViewsLoading;

  const offerAnalyticsError =
    offerAcceptancesError ||
    offerConversionsError ||
    offerConversionRatesError ||
    offerRevenueIncreasesError ||
    offerViewsError;

  const fetchAnalytics = async () => {
    return Promise.all([
      fetchOfferAcceptances(),
      fetchOfferConversions(),
      fetchOfferConversionRates(),
      fetchOfferRevenueIncreases(),
      fetchOfferViews()
    ]);
  };

  return {
    offerAcceptances,
    offerConversions,
    offerConversionRates,
    offerRevenueIncreases,
    offerViews,
    offerAnalyticsLoading,
    offerAnalyticsError,
    fetchAnalytics
  };
};

export default useOfferAnalytics;
