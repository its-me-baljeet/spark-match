import { GraphQLContext } from "@/lib/graphql/context";

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

  // 2️⃣ Check if already liked this user
  const existingLike = await ctx.db.like.findFirst({
    where: {
      fromUserId: fromUser.id,
      toUserId,
    },
  });
  if (existingLike) return false;

  // 3️⃣ Create the like
  await ctx.db.like.create({
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
    // 💞 Create match
    const match = await ctx.db.match.create({
      data: {
        participants: {
          create: [
            { userId: fromUser.id },
            { userId: toUserId },
          ],
        },
      },
    });

    // 🔥 Remove both like records after match is created
    await ctx.db.like.deleteMany({
      where: {
        OR: [
          { fromUserId: fromUser.id, toUserId },
          { fromUserId: toUserId, toUserId: fromUser.id },
        ],
      },
    });

    console.log("💖 Match created:", match.id);
  }

  return true;
}