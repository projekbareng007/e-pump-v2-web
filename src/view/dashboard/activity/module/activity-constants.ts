export type ActionType = "Login" | "Create" | "Update" | "Delete";

export interface ActivityLog {
  user: string;
  avatar?: string;
  initials: string;
  action: ActionType;
  module: string;
  description: string;
  ip: string;
  timestamp: string;
}

export const actionStyles: Record<ActionType, string> = {
  Login: "bg-primary/10 text-primary",
  Create: "bg-secondary-container text-on-secondary-container",
  Update: "bg-tertiary-container text-white",
  Delete: "bg-destructive/10 text-destructive",
};

export const activityLogs: ActivityLog[] = [
  {
    user: "Elena Rodriguez",
    avatar: "/avatars/elena.jpg",
    initials: "ER",
    action: "Login",
    module: "Authentication",
    description: "Successful authentication via OAuth2",
    ip: "192.168.1.104",
    timestamp: "Oct 19, 14:24:02",
  },
  {
    user: "Sarah Chen",
    avatar: "/avatars/sarah.jpg",
    initials: "SC",
    action: "Create",
    module: "Device Profile",
    description: "Registered new IoT Flow Sensor #B-12",
    ip: "192.168.1.112",
    timestamp: "Oct 19, 13:58:15",
  },
  {
    user: "Marcus Sterling",
    avatar: "/avatars/marcus.jpg",
    initials: "MS",
    action: "Update",
    module: "Valve Control",
    description: "Modified pressure threshold to 45 PSI",
    ip: "192.168.1.005",
    timestamp: "Oct 19, 13:42:09",
  },
  {
    user: "James Hunter",
    initials: "JH",
    action: "Delete",
    module: "System Policy",
    description: "Removed legacy 'Guest Access' policy",
    ip: "192.168.1.201",
    timestamp: "Oct 19, 12:15:33",
  },
];

export const timeLabels = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];
export const chartHeights = [64, 32, 80, 160, 96, 192];
