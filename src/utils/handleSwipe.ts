import gqlClient from "@/services/graphql";
import { LIKE_USER, PASS_USER } from "@/utils/mutations";
import { UserProfile } from "@/types";

interface HandleSwipeParams {
  dir: "left" | "right";
  swipedUser: UserProfile;
  currentUserId: string;
  setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  setUndoUser?: (user: UserProfile | null) => void;
  setUndoTimer?: (timer: NodeJS.Timeout | null) => void;
}

export const handleSwipeHelper = async ({
  dir,
  swipedUser,
  currentUserId,
  setUsers,
  setUndoUser,
  setUndoTimer,
}: HandleSwipeParams) => {
  if (!currentUserId) return;

  if (dir === "right") {
    await gqlClient.request(LIKE_USER, {
      fromClerkId: currentUserId,
      toUserId: swipedUser.id,
    });
  } else if (dir === "left") {
    await gqlClient.request(PASS_USER, {
      fromClerkId: currentUserId,
      toUserId: swipedUser.id,
    });

    if (setUndoUser && setUndoTimer) {
      setUndoUser(swipedUser);
      const timer = setTimeout(() => setUndoUser(null), 5000);
      setUndoTimer(timer);
    }
  }

  setUsers((prev) => prev.filter((u) => u.id !== swipedUser.id));
};
