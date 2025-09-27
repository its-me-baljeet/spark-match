import gql from "graphql-tag";

export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      id
      clerkId
      email
      name
      age
      bio
      gender
      birthday
      photos
      preferences {
        minAge
        maxAge
        distanceKm
        gender
      }
      location {
        lat
        lng
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      clerkId
      email
      name
      age
      bio
      gender
      birthday
      photos
      preferences {
        minAge
        maxAge
        distanceKm
        gender
      }
      location {
        lat
        lng
      }
      createdAt
      updatedAt
    }
  }
`;