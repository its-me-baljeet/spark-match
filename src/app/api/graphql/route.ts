import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { typeDefs } from "@/app/api/graphql/typedefs";
import {
  checkExistingUser,
  getCurrentUser,
  getPreferredUsers,
  registerUser,
  updateUser,
} from "./resolvers/user";
import { GraphQLContext } from "@/types/graphql";
import db from "@/services/prisma"; // ✅ your Prisma client

const resolvers = {
  Query: {
    checkExistingUser,
    getCurrentUser,
    getPreferredUsers,
  },
  Mutation: {
    registerUser,
    updateUser,
  },
};

const server = new ApolloServer<GraphQLContext>({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest, GraphQLContext>(
  server,
  {
    context: async (req) => ({
      req,
      db, // ✅ add Prisma to context
    }),
  }
);

export { handler as GET, handler as POST };
