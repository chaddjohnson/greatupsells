import { OFFER_ACCEPTANCE_FRAGMENT } from '../fragments';

export default /* GraphQL */ `
  query OfferAcceptances($id: ID!, $startAt: DateTime!, $endAt: DateTime!) {
    offerAcceptances(id: $id, startAt: $startAt, endAt: $endAt) {
      ...OfferAcceptanceFragment
    }
  }
  ${OFFER_ACCEPTANCE_FRAGMENT}
`;
