import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "@/app/api/graphql/typedefs";
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

const server = new ApolloServer({
    typeDefs,
    resolvers,
});



const handler = startServerAndCreateNextHandler(server, {
  context: async req => ({ req, db }),
});


export async function GET(request: Request) {
  return handler(request);
}

export async function POST(request: Request) {
  return handler(request);
}
