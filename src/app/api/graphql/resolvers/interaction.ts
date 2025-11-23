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
          create: [{ userId: fromUser.id }, { userId: toUserId }],
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

  // 1️⃣ Remove the like if exists (since the user passed them)
  await ctx.db.like.deleteMany({
    where: {
      fromUserId: toUserId, // OTHER user liked me
      toUserId: fromUser.id, // I am the one passing
    },
  });

  // 2️⃣ Store the pass
  await ctx.db.pass.create({
    data: {
      fromUserId: fromUser.id,
      toUserId,
    },
  });

  return true;
}

export async function undoPass(
  _parent: unknown,
  { fromClerkId, toUserId }: { fromClerkId: string; toUserId: string },
  ctx: GraphQLContext
) {
  try {
    const user = await ctx.db.user.findUnique({
      where: { clerkId: fromClerkId },
    });
    if (!user) throw new Error("User not found");

      await ctx.db.user.update({
    where: { clerkId: fromClerkId },
    data: { lastActiveAt: new Date() },
  });
    // Remove pass interaction
    await ctx.db.pass.deleteMany({
      where: {
        fromUserId: user.id,
        toUserId: toUserId,
      },
    });

    return true; // 👈 IMPORTANT! return a Boolean
  } catch (err) {
    console.error("undoPass error:", err);
    return false; // 👈 Still return something
  }
}