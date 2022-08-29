import { gql } from 'apollo-server';

const typeDefs = gql`
  type CollectorSourceSystem @key(fields: "id") {
    id: ID
    name: String
    description: String
    url: String
    urlPort: String
    protocol: String
    collectorSourceSystemStatusId: Int
    collectors: [Collector]
  }

  input CollectorSourceSystemInput {
    id: ID
    name: String
    description: String
    url: String
    urlPort: String
    protocol: String
    collectorSourceSystemStatusId: String,
  }

  input CollectorSourceSystemFilter {
    id: [ID]
    name: [String]
    keyword: String
  }

  type CollectorSourceSystemResult implements Result {
    code: Int
    errors: [ErrorItem!]
    data: [CollectorSourceSystem]
  }

  type Query {
    collectorSourceSystemList(params: CollectorSourceSystemFilter, pagination: PaginationAndSortingInput): CollectorSourceSystemResult
    collectorSourceSystemGet(id: ID!): CollectorSourceSystemResult
    collectorSourceSystemGetMany(id: [ID!]): CollectorSourceSystemResult
  }

  type Mutation {
    collectorSourceSystemCreate(params: CollectorSourceSystemInput): CollectorSourceSystemResult
    collectorSourceSystemUpdate(id: ID!, params: CollectorSourceSystemInput): CollectorSourceSystemResult
    collectorSourceSystemRemove(id: ID!): CollectorSourceSystemResult
    collectorSourceSystemRemoveMany(id: [ID!]): CollectorSourceSystemResult
  }
`;

export default typeDefs;
