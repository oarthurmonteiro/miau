// application/auth/AuthenticateUserService.ts
import { SessionRepository } from "@infraestructure/database/SessionRepository";

export async function unathenticateUser(secret: string): Promise<void> {
    const sessionRepository = new SessionRepository();

    return await sessionRepository.inactivateBySecret(secret);

}
