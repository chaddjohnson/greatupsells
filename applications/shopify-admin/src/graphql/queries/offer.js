import { gql } from 'apollo-boost';
import { OFFER_FRAGMENT } from '../fragments';

export default gql`
  query Offer($id: ID!) {
    offer(id: $id) {
      ...OfferFragment
    }
  }
  ${OFFER_FRAGMENT}
`;
