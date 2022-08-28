import { gql } from 'apollo-server';

const typeDefs = gql`
  type Group @key(fields: "id") {
    id: ID
    groupName: String
    createdAt: String
    updatedAt: String
    userCreated: User
    userUpdated: User
    "Last 2 notes in the group"
    notes: [Note]
  }

  input GroupInput {
    groupName: String
  }

  input GroupFilter {
    id: [ID]
    keyword: String
  }

  type GroupResult implements Result {
    code: Int
    errors: [ErrorItem!]
    data: [Group]
  }

  type Query {
    groupList(params: GroupFilter, pagination: PaginationAndSortingInput): GroupResult
    groupGet(id: ID!): GroupResult
    groupGetMany(id: [ID!]): GroupResult
  }

  type Mutation {
    groupCreate(params: GroupInput): GroupResult
    groupUpdate(id: ID!, params: GroupInput): GroupResult
    groupRemove(id: ID!): GroupResult
    groupRemoveMany(id: [ID!]): GroupResult
  }
`;

export default typeDefs;
