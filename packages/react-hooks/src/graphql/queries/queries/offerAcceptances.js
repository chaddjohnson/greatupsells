import { OFFER_ACCEPTANCE_FRAGMENT } from '../fragments';

export default /* GraphQL */ `
  query offerAcceptances {
    ...OfferAcceptanceFragment
  }
  ${OFFER_ACCEPTANCE_FRAGMENT}
`;
