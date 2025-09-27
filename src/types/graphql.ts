import { NextRequest } from "next/server";
import { PrismaClient } from "../../generated/prisma";

export interface GraphQLContext {
  req: NextRequest;
  db: PrismaClient;
}