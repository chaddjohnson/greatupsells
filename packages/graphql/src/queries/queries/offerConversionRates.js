import { OFFER_CONVERSION_RATE_FRAGMENT } from '../fragments';

export default /* GraphQL */ `
  query OfferConversionRates($id: ID!, $startAt: DateTime!, $endAt: DateTime!) {
    offerConversionRates(id: $id, startAt: $startAt, endAt: $endAt) {
      ...OfferConversionRateFragment
    }
  }
  ${OFFER_CONVERSION_RATE_FRAGMENT}
`;
