import useShopAcceptances from './shopAcceptances';
import useShopConversionRates from './shopConversionRates';
import useShopConversions from './shopConversions';
import useShopRevenueIncreases from './shopRevenueIncreases';
import useShopImpressions from './shopImpressions';

const useShopAnalytics = (shopId, startAt, endAt) => {
  const {
    shopAcceptances,
    shopAcceptancesLoading,
    shopAcceptancesError,
    fetchShopAcceptances
  } = useShopAcceptances(shopId, startAt, endAt);
  const {
    shopConversions,
    shopConversionsLoading,
    shopConversionsError,
    fetchShopConversions
  } = useShopConversions(shopId, startAt, endAt);
  const {
    shopConversionRates,
    shopConversionRatesLoading,
    shopConversionRatesError,
    fetchShopConversionRates
  } = useShopConversionRates(shopId, startAt, endAt);
  const {
    shopRevenueIncreases,
    shopRevenueIncreasesLoading,
    shopRevenueIncreasesError,
    fetchShopRevenueIncreases
  } = useShopRevenueIncreases(shopId, startAt, endAt);
  const {
    shopImpressions,
    shopImpressionsLoading,
    shopImpressionsError,
    fetchShopImpressions
  } = useShopImpressions(shopId, startAt, endAt);

  const shopAnalyticsLoading =
    shopAcceptancesLoading ||
    shopConversionsLoading ||
    shopConversionRatesLoading ||
    shopRevenueIncreasesLoading ||
    shopImpressionsLoading;

  const shopAnalyticsError =
    shopAcceptancesError ||
    shopConversionsError ||
    shopConversionRatesError ||
    shopRevenueIncreasesError ||
    shopImpressionsError;

  const fetchShopAnalytics = async () => {
    return await Promise.all([
      fetchShopAcceptances(),
      fetchShopConversions(),
      fetchShopConversionRates(),
      fetchShopRevenueIncreases(),
      fetchShopImpressions()
    ]);
  };

  return {
    shopAcceptances,
    shopConversions,
    shopConversionRates,
    shopRevenueIncreases,
    shopImpressions,
    shopAnalyticsLoading,
    shopAnalyticsError,
    fetchShopAnalytics
  };
};

export default useShopAnalytics;
