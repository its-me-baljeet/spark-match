import gqlClient from "@/services/graphql";
import { LIKE_USER, PASS_USER } from "@/utils/mutations";
import { UserProfile } from "@/types";

interface HandleSwipeParams {
  dir: "left" | "right";
  swipedUser: UserProfile;
  currentUserId: string;
}

export const handleSwipeHelper = async ({
  dir,
  swipedUser,
  currentUserId,
}: HandleSwipeParams) => {
  if (!currentUserId) return null

  if (dir === "right") {
    const likeId: {
      likeUser: { id: string };
    } = await gqlClient.request(LIKE_USER, {
      fromClerkId: currentUserId,
      toUserId: swipedUser.id,
    });
    return {
      type: "LIKE",
      id: likeId.likeUser.id,
    }
  } else if (dir === "left") {
    const passId: {
      passUser: { id: string };
    } = await gqlClient.request(PASS_USER, {
      fromClerkId: currentUserId,
      toUserId: swipedUser.id,
    });
    return {
      type: "PASS",
      id: passId.passUser.id,
    }
  }
};
