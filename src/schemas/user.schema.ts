import { z } from "zod";

export const userCreateSchema = z.object({
  nama: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or less"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
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
  role: z
    .enum(["user", "admin"], {
      message: "Role must be user or admin",
    })
    .nullable()
    .optional(),
});

export type UserCreateForm = z.infer<typeof userCreateSchema>;
export type UserUpdateForm = z.infer<typeof userUpdateSchema>;
