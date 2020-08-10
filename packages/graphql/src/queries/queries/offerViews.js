import { OFFER_VIEW_FRAGMENT } from '../fragments';

export default /* GraphQL */ `
  {
    offerViews {
      ...OfferViewFragment
    }
  }
  ${OFFER_VIEW_FRAGMENT}
`;
