import { OFFER_CONVERSION_FRAGMENT } from '../fragments';

export default /* GraphQL */ `
  {
    offerConversions {
      ...OfferConversionFragment
    }
  }
  ${OFFER_CONVERSION_FRAGMENT}
`;
