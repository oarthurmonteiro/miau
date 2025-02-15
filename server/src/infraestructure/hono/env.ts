import { getContext } from "hono/context-storage";

export type Env = {
  Variables: {
    userId: number;
  };
};

// You can access the variable outside the handler.
export const getUserId = () => {
  return getContext<Env>().var.userId;
};
