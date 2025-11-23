export const getLastSeenText = (lastActiveAt: string) => {
  const lastActive = new Date(lastActiveAt);
  const diffMs = Date.now() - lastActive.getTime();

  if (diffMs < 60_000) return "Active just now";
  if (diffMs < 5 * 60_000) return "Active a few minutes ago";

  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 60) return `Active ${diffMins}m ago`;

  const diffHours = Math.floor(diffMs / (60 * 60_000));
  if (diffHours < 24) return `Active ${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `Active ${diffDays}d ago`;
};
