"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userService } from "@/services/user-service";

interface OwnerSelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const UNASSIGNED = "__unassigned__";

export default function OwnerSelect({ value, onChange }: OwnerSelectProps) {
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => (await userService.getAllUsers({ page_size: 100 })).data.items,
  });

  const selectedUser = users.find((u) => u.id === value);

  return (
    <Select
      value={value ?? UNASSIGNED}
      onValueChange={(v) => onChange(v === UNASSIGNED ? null : v)}
      disabled={isLoading}
    >
      <SelectTrigger className="w-full h-auto py-3 bg-surface-container border-none rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-primary/40">
        {value && selectedUser ? (
          <span className="text-on-surface">{selectedUser.nama}</span>
        ) : (
          <SelectValue placeholder={isLoading ? "Loading…" : "Select owner"} />
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={UNASSIGNED}>
          <span className="text-on-surface-variant italic">No owner</span>
        </SelectItem>
        {users.map((u) => (
          <SelectItem key={u.id} value={u.id}>
            <span className="font-medium">{u.nama}</span>
            <span className="ml-2 text-xs text-on-surface-variant">{u.email}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
