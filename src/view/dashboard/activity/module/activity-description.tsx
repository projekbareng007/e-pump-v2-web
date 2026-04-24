"use client";

import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user-service";
import { ActivityCategory } from "@/types";
import type { UserResponse } from "@/types";

interface ActivityDescriptionProps {
  category: ActivityCategory;
  data: Record<string, unknown>;
  userMap: Map<string, UserResponse>;
}

const FIELD_LABELS: Record<string, string> = {
  device_id: "Device",
  target_user_id: "User",
  owner_id: "Owner",
  status_pompa: "Pump",
  action: "Action",
  role: "Role",
  nama: "Name",
  email: "Email",
  message: "Message",
};

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <span className="text-[10px] font-bold uppercase tracking-wider text-outline shrink-0 w-16 pt-0.5">
        {label}
      </span>
      <span className="text-xs text-on-surface break-words min-w-0">{children}</span>
    </div>
  );
}

function UserChip({ userId, userMap }: { userId: string; userMap: Map<string, UserResponse> }) {
  const cached = userMap.get(userId);

  const { data: fetched } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => (await userService.getUser(userId)).data,
    enabled: !cached,
    staleTime: 5 * 60 * 1000,
  });

  const user = cached ?? fetched;

  if (!user) {
    return (
      <span className="font-mono text-[10px] text-outline">{userId}</span>
    );
  }

  return (
    <span className="inline-flex flex-col gap-0.5">
      <span className="font-semibold text-on-surface text-xs">{user.nama}</span>
      <span className="text-[10px] text-outline">{user.email}</span>
    </span>
  );
}

export default function ActivityDescription({
  category,
  data,
  userMap,
}: ActivityDescriptionProps) {
  if (!data || Object.keys(data).length === 0) {
    return <span className="text-xs text-outline italic">No details</span>;
  }

  const entries = Object.entries(data).filter(
    ([, v]) => v !== null && v !== undefined && v !== "",
  );

  return (
    <div className="flex flex-col gap-1.5">
      {entries.map(([key, value]) => {
        const label = FIELD_LABELS[key] ?? key.replace(/_/g, " ");

        if ((key === "target_user_id" || key === "owner_id") && typeof value === "string") {
          return (
            <FieldRow key={key} label={label}>
              <UserChip userId={value} userMap={userMap} />
            </FieldRow>
          );
        }

        if (key === "status_pompa") {
          return (
            <FieldRow key={key} label={label}>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  value ? "bg-tertiary-container text-white" : "bg-surface-container text-on-surface-variant"
                }`}
              >
                {value ? "On" : "Off"}
              </span>
            </FieldRow>
          );
        }

        if (key === "role") {
          return (
            <FieldRow key={key} label={label}>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-primary/10 text-primary">
                {String(value)}
              </span>
            </FieldRow>
          );
        }

        const display =
          typeof value === "object" ? JSON.stringify(value) : String(value);

        return (
          <FieldRow key={key} label={label}>
            {display}
          </FieldRow>
        );
      })}
    </div>
  );
}
