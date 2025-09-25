import gql from "graphql-tag";

export const typeDefs = gql`
  type UserImage {
    url: String!
    publicId: String!
    order: Int
  }

type User {
  id: ID!
  clerkId: String!
  name: String!
  age: Int!
  bio: String
  gender: String!
  interests: [String!]
  images: [String!] # array of image URLs
  createdAt: String!
}


  type Query {
    checkExistingUser(clerkId: String!): Boolean
    getCurrentUser(clerkId: String!): User
  }

  input UserImageInput {
    url: String!
    publicId: String!
    order: Int
  }

  input RegisterUserInput {
    clerkId: String!
    name: String!
    age: Int!
    bio: String
    gender: String!
    interests: [String!]
    images: [UserImageInput!]
  }

  type Mutation {
    registerUser(input: RegisterUserInput!): User
  }
`;
