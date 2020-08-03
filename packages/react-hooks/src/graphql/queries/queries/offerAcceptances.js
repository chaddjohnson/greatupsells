import { OFFER_ACCEPTANCE_FRAGMENT } from '../fragments';

export default /* GraphQL */ `
  {
    offerAcceptances {
      ...OfferAcceptanceFragment
    }
  }
  ${OFFER_ACCEPTANCE_FRAGMENT}
`;
