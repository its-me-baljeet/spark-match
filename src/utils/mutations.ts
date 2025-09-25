import gql from "graphql-tag";

export const REGISTER_USER = gql`
  mutation RegisterUser(
    $clerkId: String!
    $name: String!
    $age: Int!
    $gender: String!
  ) {
    registerUser(clerkId: $clerkId, name: $name, age: $age, gender: $gender) {
      id
      clerkId
      name
      age
      bio
      gender
      interests
      createdAt
    }
  }
`;
