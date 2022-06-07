import MultiProductOffer1 from '@greatupsells/themes/MultiProductOffer1';
import MultiProductOffer2 from '@greatupsells/themes/MultiProductOffer2';
import MultiProductThankYouOffer1 from '@greatupsells/themes/MultiProductThankYouOffer1';
import SingleProductOffer1 from '@greatupsells/themes/SingleProductOffer1';

const useThemeComponent = (key) => {
  const themeComponents = {
    MultiProductOffer1,
    MultiProductOffer2,
    MultiProductThankYouOffer1,
    SingleProductOffer1
  };

  return themeComponents[key];
};

export default useThemeComponent;
