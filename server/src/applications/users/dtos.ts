import { z } from "zod";

export const RegisterUserSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(12),
  firstName: z.string().min(2).max(16),
  lastName: z.string().min(2).max(64),
});

export const UpdateUserSchema = z.object({
  email: z.string().trim().toLowerCase().email().optional(),
  password: z.string().min(12).optional(),
  firstName: z.string().min(2).max(16).optional(),
  lastName: z.string().min(2).max(64),
});