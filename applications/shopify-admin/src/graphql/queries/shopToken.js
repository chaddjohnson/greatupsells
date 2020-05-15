import { gql } from 'apollo-boost';

export default gql`
  query ShopToken($queryString: String!) {
    shopToken(queryString: $queryString) {
      token
    }
  }
`;
