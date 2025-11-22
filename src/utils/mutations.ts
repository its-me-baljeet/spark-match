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

export const LIKE_USER = gql`
  mutation LikeUser($fromClerkId: String!, $toUserId: String!) {
    likeUser(fromClerkId: $fromClerkId, toUserId: $toUserId)
  }
`;

export const PASS_USER = gql`
  mutation PassUser($fromClerkId: String!, $toUserId: String!) {
    passUser(fromClerkId: $fromClerkId, toUserId: $toUserId)
  }
`;

export const UNDO_PASS = gql`
  mutation UndoPass($fromClerkId: String!, $toUserId: String!) {
    undoPass(fromClerkId: $fromClerkId, toUserId: $toUserId)
  }
`;