"use client";

export default function StatusChip({ status }: { status: string }) {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
        isActive
          ? "bg-secondary-container text-on-secondary-container"
          : "bg-[#ffdbcb] text-tertiary"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          isActive ? "bg-secondary" : "bg-tertiary"
        }`}
      />
      {status}
    </span>
  );
}
