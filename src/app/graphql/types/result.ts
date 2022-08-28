import { gql } from 'apollo-server';

const typeDefs = gql`
  "Error messages for a specific form field or generic error description"
  type ErrorItem {
    "Name of form field to which the error is related to"
    name: String
    "Array of error messages that relate to the form field"
    messages: [String!]
  }

  "Generic response type for all of the queries and mutations"
  interface Result {
    "A number that can be used to understand if there was an error or not. All negative values mean error, zero and above not an error"
    code: Int
    "Array of errors for the query or mutation"
    errors: [ErrorItem!]
  }
`;

export default typeDefs;
