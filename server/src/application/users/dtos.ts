import { baseUserSchema } from "domain/users/User";

export const registerUserSchema = baseUserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateUserSchema = registerUserSchema.partial();
