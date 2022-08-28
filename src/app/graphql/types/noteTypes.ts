import { gql } from 'apollo-server';

const typeDefs = gql`
  type Note @key(fields: "id") {
    id: ID
    groupId: ID
    noteTitle: String
    noteBody: String
    createdAt: String
    updatedAt: String
    userCreated: User
    userUpdated: User
    group: Group
  }

  input NoteInput {
    groupId: ID
    noteTitle: String
    noteBody: String
  }

  input NoteFilter {
    id: [ID]
    groupId: [ID]
    keyword: String
  }

  type NoteResult implements Result {
    code: Int
    errors: [ErrorItem!]
    data: [Note]
  }

  type Query {
    noteList(params: NoteFilter, pagination: PaginationAndSortingInput): NoteResult
    noteGet(id: ID!): NoteResult
    noteGetMany(id: [ID!]): NoteResult
  }

  type Mutation {
    noteCreate(params: NoteInput): NoteResult
    noteUpdate(id: ID!, params: NoteInput): NoteResult
    noteRemove(id: ID!): NoteResult
    noteRemoveMany(id: [ID!]): NoteResult
  }
`;

export default typeDefs;
