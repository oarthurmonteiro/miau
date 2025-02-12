import { password } from "bun";
import { NonUniqueEmail } from "shared/errors";
import { type CreateUserInput, UserOutput } from "../dtos/User";
import type { z } from "zod";
import UserRepository from "../repositories/User";

const repo = new UserRepository();

const CreateUser = async (
  payload: z.infer<typeof CreateUserInput>,
): Promise<z.infer<typeof UserOutput>> => {
  if (false === (await isUniqueEmail(payload.email))) {
    throw new NonUniqueEmail();
  }

  const user = await repo.create(payload);
  // const user = {
  //   id: Date.now(),
  //   ...payload
  // }
  // const allUsers = await Bun.file("./storage/users.json").json()
  // if (false === isUniqueEmail(payload.email, allUsers)) {
  //   throw new NonUniqueEmail
  // }
  // allUsers.push(user);
  // await Bun.write("./storage/users.json", JSON.stringify(allUsers))
  return UserOutput.parse(user);
};

async function isUniqueEmail(email: string): Promise<boolean> {
  return (await repo.getByEmail(email)) === null;
}

export default CreateUser;
