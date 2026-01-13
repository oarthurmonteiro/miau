import { Email, Id, Password } from "@shared/types";
import { z } from "zod";

export const userSchema = z.object({
  id: Id,
  email: Email,
  password: Password,
  firstName: z.string().min(2).max(16),
  lastName: z.string().min(2).max(64),
  createdAt: z.date().readonly(),
  updatedAt: z.date().readonly(),
});

export type User = z.infer<typeof userSchema>;

export type UserWithoutPassword = Omit<User, "password">;

export const encryptPassword = async (pwd: string) =>
  await Bun.password.hash(pwd, {
    algorithm: "bcrypt",
    cost: 10, // number between 4-31
  });
