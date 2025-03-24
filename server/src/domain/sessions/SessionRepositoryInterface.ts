import type { Session } from "./Session";

export interface SessionRepositoryInterface {
  findActiveBySecret(secret: string): Promise<Session | null>;
  inactivateBySecret(secret: string): Promise<void>;
  create(session: Session): Promise<Session>;
  // update(session: Session): Promise<Session>;
}
