import { OFFER_REVENUE_INCREASE_FRAGMENT } from '../fragments';

export default /* GraphQL */ `
  query OfferRevenueIncreases(
    $id: ID!
    $startAt: DateTime!
    $endAt: DateTime!
  ) {
    offerRevenueIncreases(id: $id, startAt: $startAt, endAt: $endAt) {
      ...OfferRevenueIncreaseFragment
    }
  }
  ${OFFER_REVENUE_INCREASE_FRAGMENT}
`;
