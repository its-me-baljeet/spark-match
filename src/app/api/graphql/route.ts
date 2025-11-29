import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { typeDefs } from "@/app/api/graphql/typedefs";
import { GraphQLContext } from "@/types/graphql";
import db from "@/services/prisma"; // ✅ your Prisma client
import { checkExistingUser, getCurrentUser, getMyMatches, getPreferredUsers, getUserById, getUsersWhoLikedMe } from "./resolvers/user/queries";
import { deleteMatch, registerUser, updateUser } from "./resolvers/user/mutations";
import { likeUser, passUser, rewindUser } from "./resolvers/interaction";

const resolvers = {
  Query: {
    checkExistingUser,
    getCurrentUser,
    getPreferredUsers,
    getUsersWhoLikedMe,
    getMyMatches,
    getUserById,
  },
  Mutation: {
    registerUser,
    updateUser,
    likeUser,
    passUser,
    rewindUser,
    deleteMatch,
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
