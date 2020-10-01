export default /* GraphQL */ `
  query OfferViews($id: ID!, $startAt: DateTime!, $endAt: DateTime!) {
    offer(id: $id) {
      views(startAt: $startAt, endAt: $endAt) {
        date
        views
      }
    }
  }
`;
