import { OFFER_CONVERSION_FRAGMENT } from '../fragments';

export default /* GraphQL */ `
  query OfferConversions($id: ID!, $startAt: DateTime!, $endAt: DateTime!) {
    offerConversions(id: $id, startAt: $startAt, endAt: $endAt) {
      ...OfferConversionFragment
    }
  }
  ${OFFER_CONVERSION_FRAGMENT}
`;
