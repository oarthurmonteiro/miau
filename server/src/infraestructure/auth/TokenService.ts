import { sign, verify } from "hono/jwt";

type Payload = Record<string, unknown>;
type TokenType = "access" | "refresh";

function getSecret(type: TokenType): string {
  switch (type) {
    case "access":
      return process.env.SECRET_ACCESS_TOKEN;
    case "refresh":
      return process.env.SECRET_REFRESH_TOKEN;
  }
}

export async function generateToken(
  payload: Payload,
  expirationInSeconds: number,
  type: TokenType,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const token = await sign(
    {
      ...payload,
      iat: now,
      exp: now + expirationInSeconds,
    },
    getSecret(type),
  );

  return token;
}

export async function verifyToken(token: string, type: "access" | "refresh") {
  return await verify(token, getSecret(type));
}
