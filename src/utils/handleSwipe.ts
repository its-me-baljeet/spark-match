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
  if (!currentUserId) return null;

  if (dir === "right") {
    const data: {
      likeUser: string;
    } = await gqlClient.request(LIKE_USER, {
      fromClerkId: currentUserId,
      toUserId: swipedUser.id,
    });
    return {
      type: "LIKE",
      id: data.likeUser,
      user: swipedUser,
    };
  } else if (dir === "left") {
    const data: {
      passUser: string;
    } = await gqlClient.request(PASS_USER, {
      fromClerkId: currentUserId,
      toUserId: swipedUser.id,
    });
    return {
      type: "PASS",
      id: data.passUser,
      user: swipedUser,
    };
  }
};
