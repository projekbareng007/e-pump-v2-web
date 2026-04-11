import { z } from "zod";

export const deviceCreateSchema = z.object({
  device_id: z
    .string()
    .min(1, "Device ID is required")
    .max(64, "Device ID must be 64 characters or less"),
  owner_id: z.string().uuid("Must be a valid UUID").nullable().optional(),
  status_pompa: z.boolean().default(false),
});

export const deviceUpdateSchema = z.object({
  owner_id: z.string().uuid("Must be a valid UUID").nullable().optional(),
  status_pompa: z.boolean().nullable().optional(),
});

export type DeviceCreateForm = z.infer<typeof deviceCreateSchema>;
export type DeviceUpdateForm = z.infer<typeof deviceUpdateSchema>;
