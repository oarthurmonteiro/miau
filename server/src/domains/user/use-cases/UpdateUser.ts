import { password } from "bun";
import { NonUniqueEmail, NotFoundError } from "shared/errors";
import { type UpdateUserInput, UserOutput } from "../dtos/User";
import type { z } from "zod";

type UsersType = {
  id: number;
  email: string;
  password: string;
  firstName: string;
};

const UpdateUser = async (
  id: number,
  payload: z.infer<typeof UpdateUserInput>,
): Promise<z.infer<typeof UserOutput>> => {
  const allUsers: UsersType[] = await Bun.file("./storage/users.json").json();

  let user = allUsers.find((u) => u.id === id);
  const userIndex = allUsers.findIndex((u) => u.id === id);

  if (!user) {
    throw new NotFoundError();
  }

  if (payload.password) {
    payload.password = await password.hash(payload.password, {
      algorithm: "bcrypt",
      cost: 4, // number between 4-31
    });
  }

  if (
    payload.email &&
    user.email !== payload.email &&
    false === checkUniqueEmail(payload.email, allUsers)
  ) {
    throw new NonUniqueEmail();
  }

  user = {
    ...user,
    ...payload,
  };

  allUsers[userIndex] = user;

  await Bun.write("./storage/users.json", JSON.stringify(allUsers));
  return UserOutput.parse(user);
};

const checkUniqueEmail = (email: string, data: UsersType[]): boolean => {
  return data.filter((item) => item.email === email).length === 0;
};

export default UpdateUser;
