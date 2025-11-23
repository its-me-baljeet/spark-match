import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { typeDefs } from "@/app/api/graphql/typedefs";
import { GraphQLContext } from "@/types/graphql";
import db from "@/services/prisma"; // ✅ your Prisma client
import { checkExistingUser, getCurrentUser, getMyMatches, getPreferredUsers, getUsersWhoLikedMe } from "./resolvers/user/queries";
import { registerUser, updateUser } from "./resolvers/user/mutations";
import { likeUser, passUser, undoPass } from "./resolvers/interaction";

const resolvers = {
  Query: {
    checkExistingUser,
    getCurrentUser,
    getPreferredUsers,
    getUsersWhoLikedMe,
    getMyMatches,
  },
  Mutation: {
    registerUser,
    updateUser,
    likeUser,
    passUser,
    undoPass,
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
