import { gql } from 'apollo-server';

const typeDefs = gql`
  type CollectorHealthCheck {
    date: String
    version: String
  }

  type CollectorHealthCheckResult implements Result {
    code: Int
    errors: [ErrorItem!]
    data: [CollectorHealthCheck]
  }

  type Query {
    "Query to check health status of the Xyz microservice"
    collectorHealthCheck: CollectorHealthCheckResult
  }
`;

export default typeDefs;
