export default /* GraphQL */ `
  query OfferRevenueIncreases(
    $id: ID!
    $startAt: DateTime!
    $endAt: DateTime!
  ) {
    offer(id: $id) {
      revenueIncreases(startAt: $startAt, endAt: $endAt) {
        date
        revenueIncrease
      }
    }
  }
`;
