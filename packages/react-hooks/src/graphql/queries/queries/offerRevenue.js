import { OFFER_REVENUE_FRAGMENT } from '../fragments';

export default /* GraphQL */ `
  query offerRevenues {
    ...OfferRevenueFragment
  }
  ${OFFER_REVENUE_FRAGMENT}
`;
