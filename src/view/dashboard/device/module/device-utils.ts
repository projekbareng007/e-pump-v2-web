export const pumpStatusStyles = {
  on: {
    border: "border-b-secondary/20",
    bg: "bg-secondary-container/30",
    dot: "bg-secondary",
    text: "text-on-secondary-container",
    label: "Active",
  },
  off: {
    border: "border-b-outline-variant/20",
    bg: "bg-surface-container-high",
    dot: "bg-outline",
    text: "text-on-surface-variant",
    label: "Inactive",
  },
} as const;

export function getStyle(active: boolean) {
  return active ? pumpStatusStyles.on : pumpStatusStyles.off;
}

export function formatLastSeen(date: string | null) {
  if (!date) return "Never";
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export function isUrgent(date: string | null) {
  if (!date) return true;
  return Date.now() - new Date(date).getTime() > 3_600_000;
}
