export default `
  mutation TrackOfferView(
    $offerId: ID!,
    $productId: Long,
    $variantId: Long,
  ) {
    trackOfferView(
      offerId: $offerId,
      productId: $productId,
      variantId: $variantId
    ) {
      _id
    }
  }
`;
