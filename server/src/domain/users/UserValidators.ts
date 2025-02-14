import type { UserRepository } from "./UserRepository";

export class UserValidators {
  constructor(private readonly userRepository: UserRepository) {}

  async emailIsUnique(email: string): Promise<boolean> {
    return (await this.userRepository.findByEmail(email)) === null;
  }
}