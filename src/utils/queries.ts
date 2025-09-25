import gql from "graphql-tag";

export const CHECK_USER = gql`
  query Query($clerkId: String!) {
    checkExistingUser(clerkId: $clerkId)
  }
`;

export const GET_CURRENT_USER = gql`
  query getCurrentUser($clerkId: String!) {
    getCurrentUser(clerkId: $clerkId) {
      id
      clerkId
      name
      age
      bio
      gender
      interests
      images
      createdAt
    }
  }
`;
