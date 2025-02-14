import { Email, Id, Password } from "@shared/types";
import { z } from "zod";

export const baseUserSchema = z.object({
  id: Id.readonly(),
  email: Email,
  password: Password,
  firstName: z.string().min(2).max(16),
  lastName: z.string().min(2).max(64),
  createdAt: z.date().readonly(),
  updatedAt: z.date().readonly(),
});

const userClassSchema = baseUserSchema.partial({
  id: true,
  createdAt: true,
  updatedAt: true,
});

const userClassDataSchema = userClassSchema.omit({ password: true });

export const userOutputSchema = baseUserSchema.omit({ password: true });
export type UserOutputData = z.infer<typeof userOutputSchema>;

export class User {
  #data;
  #password;

  constructor(data: z.infer<typeof userClassSchema>) {
    const { password } = data;

    this.#data = userClassDataSchema.parse(data);
    this.#password = password;
  }

  public get data() {
    return this.#data;
  }

  public set data(newData: z.infer<typeof userClassDataSchema>) {
    this.#data = userClassDataSchema.parse({
      ...this.#data,
      newData,
    });
  }

  public get password() {
    return this.#password;
  }

  public set password(newPassword: string) {
    this.#password = newPassword;
  }

  public async encryptPassword(pwd = this.#password): Promise<string> {
    this.password = await Bun.password.hash(pwd, {
      algorithm: "bcrypt",
      cost: 10, // number between 4-31
    });

    return this.password;
  }

  public checkPasswordIdentity(pwd: string): boolean {
    return pwd === this.password;
  }
}
