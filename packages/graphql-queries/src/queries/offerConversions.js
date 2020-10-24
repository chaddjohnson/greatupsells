export default /* GraphQL */ `
  query OfferConversions($id: ID!, $startAt: DateTime!, $endAt: DateTime!) {
    offer(id: $id) {
      conversions(startAt: $startAt, endAt: $endAt) {
        date
        conversions
      }
    }
  }
`;
