import db from "infra/database";
import type { RegisterUserInput, UpdateUserInput } from './dtos';
import type { z } from "zod";
import { password } from "bun";

export default class UserRepository {
  #encryptPassword = async (pwd: string) => {
    return await password.hash(pwd, {
      algorithm: "bcrypt",
      cost: 10, // number between 4-31
    });
  };

  async getByEmail(email: string) {
    return await db.user.findUnique({
      where: { email: email },
    });
  }

  async getById(id: number) {
    return await db.user.findUnique({
      where: { id: id },
    });
  }

  async create(payload: z.infer<typeof RegisterUserInput>) {
    payload.password = await this.#encryptPassword(payload.password);

    return db.user.create({ data: payload });
  }

  async update(id: number, payload: z.infer<typeof UpdateUserInput>) {
    if (payload.password) {
      payload.password = await this.#encryptPassword(payload.password);
    }

    return db.user.update({
      where: { id: id },
      data: payload,
    });
  }
}
