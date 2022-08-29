import { gql } from 'apollo-server';

const typeDefs = gql`
  type Collector @key(fields: "id") {
    id: ID
    name: String
    collectorSourceSystem: CollectorSourceSystem
    fileType: String
    sourceFilePath: String
    sourceFileLevel: String
    destinationBucketName: String
    destinationFilePath: String
    sourceFileNamePattern: String,
    sourceFileNameConvention: String,
    destinationFileNameConvention: String
    lastDownloadTimestampMs: String
    collectorStatusId: Int
    maxRetry: Int
    maxSize: Int
  }

  input CollectorInput {
    id: ID
    name: String
    fileType: String
    collectorStatusId: Int
  }

  input CollectorFilter {
    id: [ID]
    name: [String]
    keyword: String
  }

  type CollectorResult implements Result {
    code: Int
    errors: [ErrorItem!]
    data: [Collector]
  }

  type Query {
    collectorList(params: CollectorFilter, pagination: PaginationAndSortingInput): CollectorResult
    collectoreGet(id: ID!): CollectorResult
    collectorGetMany(id: [ID!]): CollectorResult
  }

  type Mutation {
    collectorCreate(params: CollectorInput): CollectorResult
    collectorUpdate(id: ID!, params: CollectorInput): CollectorResult
    collectorRemove(id: ID!): CollectorResult
    collectoreRemoveMany(id: [ID!]): CollectorResult
  }
`;

export default typeDefs;
