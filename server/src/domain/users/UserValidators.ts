import type { UserRepositoryInterface } from "./UserRepositoryInterface";

export class UserValidators {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async emailIsUnique(email: string): Promise<boolean> {
    return (await this.userRepository.findByEmail(email)) === null;
  }
}
