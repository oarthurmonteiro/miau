import { Model } from "@domain/Model";
import { Id } from "@shared/types";
import { z } from "zod";

export const baseSessionSchema = z.object({
  id: Id.readonly(),
  secret: z.string().readonly(),
  createdAt: z.date().readonly(),
  expiresAt: z.date(),
  userId: Id.readonly(),
});

const sessionClassSchema = baseSessionSchema.partial({
  id: true,
  createdAt: true,
  secret: true,
});

export type SessionOutputType = z.infer<typeof baseSessionSchema>;

export class Session extends Model<typeof sessionClassSchema> {
  constructor(data: z.infer<typeof sessionClassSchema>) {
    super(sessionClassSchema, data);
  }
}
