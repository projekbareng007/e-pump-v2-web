import { ActivityCategory } from "@/types";

export const categoryStyles: Record<ActivityCategory, string> = {
  [ActivityCategory.DEVICE]: "bg-secondary-container text-on-secondary-container",
  [ActivityCategory.CONTROL]: "bg-tertiary-container text-white",
  [ActivityCategory.ADMINISTRATIVE]: "bg-primary/10 text-primary",
};

export const categoryLabels: Record<ActivityCategory, string> = {
  [ActivityCategory.DEVICE]: "Device",
  [ActivityCategory.CONTROL]: "Control",
  [ActivityCategory.ADMINISTRATIVE]: "Administrative",
};

export function describeActivity(
  category: ActivityCategory,
  data: Record<string, unknown>,
): string {
  if (!data || Object.keys(data).length === 0) {
    return categoryLabels[category];
  }
  const entries = Object.entries(data)
    .filter(([, v]) => v !== null && v !== undefined)
    .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : String(v)}`);
  return entries.join(" • ");
}

export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
