import db from "infra/database";
import type { CreateUserInput } from "../dtos/User";
import type { z } from "zod";
import { password } from "bun";

export default class UserRepository {
  async getAll() {
    return await db.user.findMany();
  }

  async getByEmail(email: string) {
    return await db.user.findUnique({
      where: { email: email },
    });
  }

  async getById(id: number) {
    return await db.user.findUniqueOrThrow({
      where: { id: id },
    });
  }

  async create(payload: z.infer<typeof CreateUserInput>) {
    payload.password = await password.hash(payload.password, {
      algorithm: "bcrypt",
      cost: 4, // number between 4-31
    });

    return db.user.create({ data: payload });
  }
}
