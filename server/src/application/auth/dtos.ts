import { Email, Password } from "@shared/types";
import { z } from "zod";

export const loginSchema = z.object({
  email: Email,
  password: Password,
});
