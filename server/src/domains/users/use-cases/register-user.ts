import type { z } from "zod";
import { NonUniqueEmail } from "shared/errors";
import { UserOutput, type RegisterUserInput } from "../dtos";
import UserRepository from "../repository";

const repo = new UserRepository();

const CreateUser = async (
  payload: z.infer<typeof RegisterUserInput>,
): Promise<z.infer<typeof UserOutput>> => {
  if (false === (await isUniqueEmail(payload.email))) {
    throw new NonUniqueEmail();
  }

  const user = await repo.create(payload);

  return UserOutput.parse(user);
};

async function isUniqueEmail(email: string): Promise<boolean> {
  return (await repo.getByEmail(email)) === null;
}

export default CreateUser;
