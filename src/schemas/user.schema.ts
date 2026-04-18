import { z } from "zod";

const roleEnum = z.enum(["user", "admin", "superuser"], {
  message: "Role must be user, admin, or superuser",
});

export const userCreateSchema = z.object({
  nama: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: roleEnum.optional(),
});

export const userUpdateSchema = z.object({
  nama: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less")
    .nullable()
    .optional(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .nullable()
    .optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nullable()
    .optional()
    .or(z.literal("")),
  role: roleEnum.nullable().optional(),
});

export type UserCreateForm = z.infer<typeof userCreateSchema>;
export type UserUpdateForm = z.infer<typeof userUpdateSchema>;
