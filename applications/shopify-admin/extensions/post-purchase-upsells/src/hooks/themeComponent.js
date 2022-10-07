import React from 'react';
import PostPurchaseMultiProductOffer1 from '../../../../../../packages/themes-storefront/dist/PostPurchaseMultiProductOffer1';
import PostPurchaseSingleProductOffer1 from '../../../../../../packages/themes-storefront/dist/PostPurchaseSingleProductOffer1';

const themes = {
  PostPurchaseMultiProductOffer1,
  PostPurchaseSingleProductOffer1
};

const useThemeComponent = (key) => {
  return themes[key];
};

export default useThemeComponent;
