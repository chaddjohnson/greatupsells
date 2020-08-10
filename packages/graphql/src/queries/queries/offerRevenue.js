import { OFFER_REVENUE_FRAGMENT } from '../fragments';

export default /* GraphQL */ `
  {
    offerRevenues {
      ...OfferRevenueFragment
    }
  }
  ${OFFER_REVENUE_FRAGMENT}
`;
