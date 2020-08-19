import { OFFER_VIEW_FRAGMENT } from '../fragments';

export default /* GraphQL */ `
  query OfferViews($id: ID!, $startAt: DateTime!, $endAt: DateTime!) {
    offerViews(id: $id, startAt: $startAt, endAt: $endAt) {
      ...OfferViewFragment
    }
  }
  ${OFFER_VIEW_FRAGMENT}
`;
