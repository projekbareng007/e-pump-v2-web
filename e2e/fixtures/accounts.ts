export type Role = "superuser" | "admin" | "user";

export interface Account {
  role: Role;
  email: string;
  password: string;
}

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var ${name}. See e2e/README.md.`);
  return v;
}

export const accounts: Record<Role, Account> = {
  superuser: {
    role: "superuser",
    email: process.env.E2E_SUPERUSER_EMAIL ?? "",
    password: process.env.E2E_SUPERUSER_PASSWORD ?? "",
  },
  admin: {
    role: "admin",
    email: process.env.E2E_ADMIN_EMAIL ?? "",
    password: process.env.E2E_ADMIN_PASSWORD ?? "",
  },
  user: {
    role: "user",
    email: process.env.E2E_USER_EMAIL ?? "",
    password: process.env.E2E_USER_PASSWORD ?? "",
  },
};

export function account(role: Role): Account {
  const a = accounts[role];
  if (!a.email || !a.password) {
    required(`E2E_${role.toUpperCase()}_EMAIL`);
    required(`E2E_${role.toUpperCase()}_PASSWORD`);
  }
  return a;
}
