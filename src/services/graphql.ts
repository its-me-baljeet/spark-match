import { GraphQLClient } from "graphql-request";

const baseURL = process.env.NEXT_PUBLIC_HOST_NAME || "http://localhost:3000";

// Always append /api/graphql
const gqlClient = new GraphQLClient(`${baseURL}/api/graphql`);

export default gqlClient;
