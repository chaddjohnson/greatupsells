import { OFFER_FRAGMENT } from '../fragments';

export default /* GraphQL */ `
  {
    offer {
      ...OfferFragment
    }
  }
  ${OFFER_FRAGMENT}
`;
