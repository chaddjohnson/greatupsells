export default /* GraphQL */ `
  mutation TrackOfferAcceptance(
    $offerHitId: ID!,
    productId: Long,
    variantId: Long,
    quantity: Int
  ) {
    trackOfferAcceptance(
      offerHitId: $offerHitId,
      productId: $productId,
      variantId: $variantId,
      quantity: $quantity
    ) {
      _id
    }
  }
`;
