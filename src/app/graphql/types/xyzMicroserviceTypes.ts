import { gql } from 'apollo-server';

const typeDefs = gql`
  type XyzMicroserviceHealth {
    date: String
    version: String
  }

  type XyzMicroserviceHealthResult implements Result {
    code: Int
    errors: [ErrorItem!]
    data: [XyzMicroserviceHealth]
  }

  type Query {
    "Query to check health status of the Xyz microservice"
    xyzMicroserviceHealth: XyzMicroserviceHealthResult
  }
`;

export default typeDefs;
