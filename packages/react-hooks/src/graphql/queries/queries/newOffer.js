import { OFFER_FRAGMENT } from '../fragments';

export default /* GraphQL */ `
  query Offer {
    offer {
      ...OfferFragment
    }
  }
  ${OFFER_FRAGMENT}
`;
