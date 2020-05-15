import { gql } from 'apollo-boost';
import { OFFER_FRAGMENT } from '../fragments';

export default gql`
  mutation CreateOffer($input: OfferInput!) {
    createOffer(input: $input) {
      ...OfferFragment
    }
  }
  ${OFFER_FRAGMENT}
`;
