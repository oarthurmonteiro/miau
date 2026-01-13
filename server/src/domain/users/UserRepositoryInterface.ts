import type { User, UserWithoutPassword } from "./User";

export interface UserRepositoryInterface {
  findById(id: number): Promise<UserWithoutPassword | null>;
  findByEmail(email: string): Promise<UserWithoutPassword | null>;
  create(
    user: Omit<User, "id" | "createdAt" | "updatedAt">,
  ): Promise<UserWithoutPassword>;
  update(
    userId: number,
    user: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>,
  ): Promise<UserWithoutPassword>;
}
