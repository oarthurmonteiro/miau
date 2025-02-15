import { Email, Password } from "@shared/types";
import { z } from "zod";

export const loginSchema = z.object({
  email: Email,
  password: Password,
});

export const successfullLoginOutput = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
});

export type SuccefullLoginOutput = z.infer<typeof successfullLoginOutput>;
