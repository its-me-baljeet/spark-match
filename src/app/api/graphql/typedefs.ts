import gql from "graphql-tag";

export const typeDefs = gql`
  type User {
  id: ID!
  clerkId: String!
  name: String!
  age: Int!
  bio: String
  gender: String!
  interests: [String!]
  createdAt: String!
}

type Query {
  checkExistingUser(clerkId: String!): Boolean
}

type Mutation {
  registerUser(
    clerkId: String!
    name: String!
    age: Int!
    bio: String
    gender: String!
    interests: [String!]
  ): User
}
`;