// lib/graphql/context.ts
import { PrismaClient } from "../../../generated/prisma";

export type GraphQLContext = {
  db: PrismaClient;
  user?: { id: string }; // whatever Clerk gives you
};
