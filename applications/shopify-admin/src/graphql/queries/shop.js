import { gql } from 'apollo-boost';
import { SHOP_FRAGMENT } from '../fragments';

export default gql`
  query Shop($id: ID!) {
    shop(id: $id) {
      ...ShopFragment
    }
  }
  ${SHOP_FRAGMENT}
`;
