import { OFFER_FRAGMENT } from '../fragments';

export default /* GraphQL */ `
  mutation CreateOffer($input: OfferInput!) {
    createOffer(input: $input) {
      ...OfferFragment
    }
  }
  ${OFFER_FRAGMENT}
`;
