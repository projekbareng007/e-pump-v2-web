"use client";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterPillProps {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  children: React.ReactNode;
}

export default function FilterPill({ label, value, onValueChange, children }: FilterPillProps) {
  return (
    <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm">
      <span className="text-xs font-bold uppercase tracking-wider text-outline">
        {label}:
      </span>
      <Select value={value} onValueChange={(v) => onValueChange(v ?? "all")}>
        <SelectTrigger className="border-none bg-transparent shadow-none h-auto p-0 text-sm font-medium min-w-[100px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  );
}
