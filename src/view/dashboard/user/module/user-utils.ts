export const roleStyles: Record<string, string> = {
  superuser: "bg-tertiary-container/10 text-tertiary",
  admin: "bg-primary-container/10 text-primary",
  user: "bg-secondary-container/10 text-secondary",
};

export function getRoleStyle(role: string) {
  return roleStyles[role] ?? roleStyles.user;
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function formatRoleLabel(role: string) {
  if (role === "superuser") return "Super Admin";
  return role.charAt(0).toUpperCase() + role.slice(1);
}
