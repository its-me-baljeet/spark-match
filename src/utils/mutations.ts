import gql from "graphql-tag";

export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterUserInput!) {
    registerUser(input: $input) {
      id
      clerkId
      name
      age
      bio
      gender
      interests
      images {
        url
        publicId
        order
      }
      createdAt
    }
  }
`;
