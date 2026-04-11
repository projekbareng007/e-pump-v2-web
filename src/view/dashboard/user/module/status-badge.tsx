"use client";

export default function StatusBadge({ status }: { status: string }) {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
        isActive
          ? "bg-secondary-container text-secondary"
          : "bg-surface-container-highest text-on-surface-variant"
      }`}
    >
      {isActive && (
        <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
      )}
      {status}
    </span>
  );
}
