declare module "bun" {
  interface Env {
    SECRET_ACCESS_TOKEN: string;
    SECRET_REFRESH_TOKEN: string;
    DATABASE_URL: string;
  }
}
