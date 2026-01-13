import { Model } from "@domain/Model";
import { Id } from "@shared/types";
import { z } from "zod";

export const sessionSchema = z.object({
  id: Id.readonly(),
  secret: z.string().readonly(),
  createdAt: z.date().readonly(),
  expiresAt: z.date(),
  userId: Id.readonly(),
});

export type Session = z.infer<typeof sessionSchema>;
