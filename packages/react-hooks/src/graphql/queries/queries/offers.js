import { OFFER_FRAGMENT } from '../fragments';

export default /* GraphQL */ `
  query offer {
    ...OfferFragment
  }
  ${OFFER_FRAGMENT}
`;
