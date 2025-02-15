import { Prisma } from "@prisma/client";
import { z } from "zod";

export const Id = z.coerce.number().gt(0);

export const Email = z.string().trim().toLowerCase().email();

export const Password = z.string().min(12);

export const Decimal = z.custom<Prisma.Decimal>((val) => {
  try {
    return new Prisma.Decimal(val);
  } catch (err) {
    return false;
  }
});

export const DecimalToNumber = Decimal.transform((val) => val.toNumber());
