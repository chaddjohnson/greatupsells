export default /* GraphQL */ `
  query ShopToken($queryString: String!) {
    shopToken(queryString: $queryString) {
      token
    }
  }
`;
