import { SHOP_FRAGMENT } from '../fragments';

export default /* GraphQL */ `
  {
    shop {
      ...ShopFragment
    }
  }
  ${SHOP_FRAGMENT}
`;
