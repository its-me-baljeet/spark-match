import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { typeDefs } from "@/app/api/graphql/typedefs";
import { checkExistingUser, registerUser } from "./resolvers/user";


const resolvers = {
  Query: {
    checkExistingUser,
  },
  Mutation: {
    registerUser,
  }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Typescript: req has the type NextRequest
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async req => ({ req }),
});

export { handler as GET, handler as POST };