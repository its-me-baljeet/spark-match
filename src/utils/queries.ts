import gql from "graphql-tag";

export const CHECK_USER = gql`
  query Query($clerkId: String!) {
    checkExistingUser(clerkId: $clerkId)
  }
`;
