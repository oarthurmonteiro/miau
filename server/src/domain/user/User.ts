import { z } from "zod";

export const userSchema = z.object({
  id: z.number().readonly().optional(),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(12),
  firstName: z.string().min(2).max(16),
  lastName: z.string().min(2).max(64),
  createdAt: z.date().readonly().optional(),
  updatedAt: z.date().readonly().optional(),
});

export type UserData = z.infer<typeof userSchema>;

export class User {
  public data;
  #password;

  constructor(data: UserData) {
    const { password } = data;
    this.data = userSchema.omit({ password: true }).parse(data);
    this.#password = password;
  }

  public get password(): string {
    return this.#password;
  }

  public checkPasswordIdentity(pwd: string): boolean {
    return pwd === this.password;
  }
}

// export function userFactory(data: UserData) {

//     const { password } = data
//     const user = userSchema.omit({password: true}).parse(data)

//     const checkPasswordIdentity = (pwd: string) => {
//         return password === pwd
//     }

//     return {
//         ...user,
//         checkPasswordIdentity
//     }
// }

// export type User = ReturnType<typeof userFactory>;
