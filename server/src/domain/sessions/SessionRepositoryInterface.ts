import type { Session } from "./Session";

export interface SessionRepositoryInterface {
  findActiveBySecret(secret: string): Promise<Session | null>;
  inactivateBySecret(secret: string): Promise<void>;
  create(expiresAt: Date, userId: number): Promise<Session>;
  // update(session: Session): Promise<Session>;
}
