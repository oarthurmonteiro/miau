import { sign } from "hono/jwt";

export async function generateAccessToken<T extends Record<string, unknown>>(
  payload: T,
  expirationInSeconds: number,
) {
  const now = Math.floor(Date.now() / 1000);
  const secret = "super-duper-secret";
  const token = await sign(
    {
      ...payload,
      iat: now,
      exp: now + expirationInSeconds,
    },
    secret,
  );

  return token;
}

export async function generateRefreshToken<T extends Record<string, unknown>>(
  payload: T,
  expirationInSeconds: number,
) {
  const now = Math.floor(Date.now() / 1000);
  const secret = "super-refresh-secret";
  const token = await sign(
    {
      ...payload,
      iat: now,
      exp: now + expirationInSeconds,
    },
    secret,
  );

  return token;
}
