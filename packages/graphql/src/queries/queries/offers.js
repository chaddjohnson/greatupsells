import { OFFER_FRAGMENT } from '../fragments';

export default /* GraphQL */ `
  {
    offers {
      ...OfferFragment
    }
  }
  ${OFFER_FRAGMENT}
`;
