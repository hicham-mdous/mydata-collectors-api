import { gql } from 'apollo-server';

const typeDefs = gql`
  enum SortItemDirection {
    ASC
    DESC
  }

  input SortItem {
    name: String
    order: SortItemDirection!
  }

  input PaginationAndSortingInput {
    page: Int
    pageSize: Int
    sortBy: [SortItem!]
  }
`;

export default typeDefs;
