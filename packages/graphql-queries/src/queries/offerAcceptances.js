export default /* GraphQL */ `
  query OfferAcceptances($id: ID!, $startAt: DateTime!, $endAt: DateTime!) {
    offer(id: $id) {
      acceptances(startAt: $startAt, endAt: $endAt) {
        date
        acceptances
      }
    }
  }
`;
