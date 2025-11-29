import { GraphQLContext } from "@/lib/graphql/context";
import db from "@/services/prisma";
import { LastInteraction } from "@/types";

export async function likeUser(
  _parent: unknown,
  args: { fromClerkId: string; toUserId: string },
  ctx: GraphQLContext
) {
  const { fromClerkId, toUserId } = args;

  // 1️⃣ Get current user
  const fromUser = await ctx.db.user.findUnique({
    where: { clerkId: fromClerkId },
  });
  if (!fromUser) throw new Error("User not found");

  await ctx.db.user.update({
    where: { clerkId: fromClerkId },
    data: { lastActiveAt: new Date() },
  });

  // 2️⃣ Check if already liked this user
  const existingLike = await ctx.db.like.findFirst({
    where: {
      fromUserId: fromUser.id,
      toUserId,
    },
  });
  if (existingLike) return false;

  // 3️⃣ Create the like
  const like = await ctx.db.like.create({
    data: {
      fromUserId: fromUser.id,
      toUserId,
    },
  });

  // 4️⃣ Check mutual like
  const mutualLike = await ctx.db.like.findFirst({
    where: {
      fromUserId: toUserId,
      toUserId: fromUser.id,
    },
  });

  if (mutualLike) {
    const match = await ctx.db.match.create({
      data: {
        participants: {
          create: [{ userId: fromUser.id }, { userId: toUserId }],
        },
      },
    });

    console.log("💖 Match created:", match.id);
  }

  return like.id;
}
export async function passUser(
  _parent: unknown,
  { fromClerkId, toUserId }: { fromClerkId: string; toUserId: string },
  ctx: GraphQLContext
) {
  const fromUser = await ctx.db.user.findUnique({
    where: { clerkId: fromClerkId },
  });
  if (!fromUser) throw new Error("User not found");

    await ctx.db.user.update({
    where: { clerkId: fromClerkId },
    data: { lastActiveAt: new Date() },
  });

  // 2️⃣ Store the pass
  const pass = await ctx.db.pass.create({
    data: {
      fromUserId: fromUser.id,
      toUserId,
    },
  });

  return pass.id;
}

export async function rewindUser (
  _parent: unknown,
   {lastInteraction} : { lastInteraction: LastInteraction},
){
  console.log("Rewinding interaction:", lastInteraction);
  try{
    if(lastInteraction.type==="LIKE"){
      await db.like.deleteMany({
        where:{
          id:lastInteraction.id
        }
      });
    }
    else if(lastInteraction.type==="PASS"){
      await db.pass.deleteMany({
        where:{
          id:lastInteraction.id
        }
      });
    }
    return true;
  } catch (error) {
    console.error("Error in rewindUser:", error);
    return false;
  }
}