import { GraphQLClient } from "graphql-request";


const host = process.env.NEXT_PUBLIC_HOST_NAME || "http://localhost:3000/api/graphql";
const gqlClient = new GraphQLClient(`${host}`);

export default gqlClient;