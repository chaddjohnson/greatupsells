import { SHOP_FRAGMENT } from '../fragments';

export default /* GraphQL */ `
  query Shop($id: ID!) {
    shop(id: $id) {
      ...ShopFragment
    }
  }
  ${SHOP_FRAGMENT}
`;
