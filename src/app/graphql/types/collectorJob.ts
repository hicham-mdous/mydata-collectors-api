import { gql } from 'apollo-server';

const typeDefs = gql`
  type CollectorJob @key(fields: "id") {
    id: ID
    name: String
    collector: Collector
    running: Int
    scheduled: Boolean
    nextInvocationTime: String
    lastInvocationTime: String
  }

  input CollectorJobInput {
    id: ID
    name: String
    collectorId: Int
  }

  input CollectorJobFilter {
    id: [ID]
    name: [String]
    keyword: String
  }

  type CollectorJobResult implements Result {
    code: Int
    errors: [ErrorItem!]
    data: [CollectorJob]
  }

  type Query {
    collectorJobList(params: CollectorJobFilter, pagination: PaginationAndSortingInput): CollectorResult
    collectorJobGet(id: ID!): CollectorJobResult
    collectorJobGetMany(id: [ID!]): CollectorJobResult
  }

  type Mutation {
    collectorJobCreate(params: CollectorJobInput): CollectorJobResult
    collectorJobUpdate(id: ID!, params: CollectorJobInput): CollectorJobResult
    collectorJobRemove(id: ID!): CollectorJobResult
    collectorJobRemoveMany(id: [ID!]): CollectorJobResult
  }
`;

export default typeDefs;
