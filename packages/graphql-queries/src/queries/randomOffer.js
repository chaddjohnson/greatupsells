import { OFFER_FRAGMENT } from '../fragments';

export default /* GraphQL */ `
  query RandomOffer($event: String!, shopifyProductIds: [Long]) {
    offer(event: $event, shopifyProductIds: $shopifyProductIds) {
      ...OfferFragment
      product {
        shopifyProductData
      }
    }
  }
  ${OFFER_FRAGMENT}
`;
