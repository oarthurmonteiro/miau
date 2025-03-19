import type { Session } from "./Session";

export interface SessionRepositoryInterface {
  create(session: Session): Promise<Session>;
  // update(session: Session): Promise<Session>;
}
