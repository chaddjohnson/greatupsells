export default /* GraphQL */ `
  query OfferConversionRates($id: ID!, $startAt: DateTime!, $endAt: DateTime!) {
    offer(id: $id) {
      conversionRates(startAt: $startAt, endAt: $endAt) {
        date
        conversionRate
      }
    }
  }
`;
