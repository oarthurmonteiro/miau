import { userSchema } from "domain/users/User";

export const registerUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateUserSchema = registerUserSchema.partial();

export const outputUserSchema = userSchema.omit({ password: true });
