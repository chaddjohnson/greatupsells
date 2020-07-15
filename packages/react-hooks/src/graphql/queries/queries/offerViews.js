import { OFFER_VIEW_FRAGMENT } from '../fragments';

export default /* GraphQL */ `
  query offerViews {
    ...OfferViewFragment
  }
  ${OFFER_VIEW_FRAGMENT}
`;
