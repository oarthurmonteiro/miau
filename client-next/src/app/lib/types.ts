import { z } from "zod";

export const Id = z.coerce.number().gt(0);

export const Email = z.string().trim().toLowerCase().email();

export const Password = z.string().min(12);
