import gql from "graphql-tag";

export const CHECK_USER = gql`
  query CheckUser($clerkId: String!) {
    checkExistingUser(clerkId: $clerkId)
  }
`;

export const GET_CURRENT_USER = gql`
  query GetCurrentUser($clerkId: String!) {
    getCurrentUser(clerkId: $clerkId) {
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