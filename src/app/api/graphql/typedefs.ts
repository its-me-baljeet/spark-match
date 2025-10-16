import gql from "graphql-tag";

export const typeDefs = gql`
  enum Gender {
    MALE
    FEMALE
    OTHER
  }

  type UserPhoto {
    id: ID!
    url: String!
    publicId: String!
    order: Int!
  }

  type User {
    id: ID!
    clerkId: String!
    email: String!
    name: String!
    age: Int!
    bio: String
    gender: Gender!
    birthday: String!
    photos: [String!]!
    preferences: UserPreference
    location: Location!
    createdAt: String!
    updatedAt: String!
  }

  type UserPreference {
    minAge: Int!
    maxAge: Int!
    distanceKm: Int!
    gender: Gender
  }

  type Location {
    lat: Float!
    lng: Float!
  }

  input UserPhotoInput {
    url: String!
    publicId: String!
    order: Int
  }

  input PhotoUpsertInput {
    id: ID
    url: String!
    publicId: String!
    order: Int
  }

  input RegisterUserInput {
    clerkId: String!
    email: String!
    name: String!
    birthday: String!
    bio: String
    gender: Gender!
    photos: [UserPhotoInput!]
    location: LocationInput!
    preferences: PreferenceInput
  }

  input PreferenceInput {
    minAge: Int!
    maxAge: Int!
    distanceKm: Int!
    gender: Gender
  }

  input UpdateUserInput {
    clerkId: String!
    name: String!
    birthday: String!
    bio: String
    gender: Gender!
    photos: [PhotoUpsertInput!]
    location: LocationInput!
    preferences: PreferenceInput
  }

  input LocationInput {
    lat: Float!
    lng: Float!
  }

  type Query {
    checkExistingUser(clerkId: String!): Boolean!
    getCurrentUser(clerkId: String!): User
    getPreferredUsers(clerkId: String!): [User!]!
  }

  type Mutation {
    registerUser(input: RegisterUserInput!): User!
    updateUser(input: UpdateUserInput!): User!
  }
`;
