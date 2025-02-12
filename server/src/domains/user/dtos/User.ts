import { z } from "zod";

export const CreateUserInput = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(12),
  firstName: z.string().min(2).max(16),
  lastName: z.string().min(2).max(64),
});

export const UpdateUserInput = z.object({
  email: z.string().trim().toLowerCase().email().optional(),
  password: z.string().min(12).optional(),
  firstName: z.string().min(2).max(16).optional(),
  lastName: z.string().min(2).max(64),
});

export const UserOutput = z.object({
  id: z.number().gt(0),
  email: z.string().trim().toLowerCase().email(),
  firstName: z.string().min(2).max(16),
  lastName: z.string().min(2).max(64),
  createdAt: z.date(),
  updatedAt: z.date(),
});
