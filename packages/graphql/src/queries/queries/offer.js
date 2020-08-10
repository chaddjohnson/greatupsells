import { OFFER_FRAGMENT } from '../fragments';

export default /* GraphQL */ `
  query Offer($id: ID!) {
    offer(id: $id) {
      ...OfferFragment
    }
  }
  ${OFFER_FRAGMENT}
`;
