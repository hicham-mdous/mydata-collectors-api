import { gql } from 'apollo-server';

const typeDefs = gql`
  extend type User @key(fields: "id") {
    id: ID @external
  }

  extend type Organization @key(fields: "id") {
    id: ID @external
  }
`;

export default typeDefs;
