import { AppError } from "shared/errors";
import { Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import v1 from "./routes/v1";
import { showRoutes } from "hono/dev";
import { getConnInfo } from "hono/bun";

const app = new Hono();

// Global error handler
app.onError((err, c) => {
  if (err instanceof AppError) {
    return c.json(
      {
        success: false,
        error: {
          message: err.message,
          details: err.details,
        },
      },
      err.statusCode as ContentfulStatusCode,
    );
  }

  // Generic error handler
  console.error("Unhandled error:", err);
  return c.json({}, 500);
});

app.route("/api/v1", v1);

app.get("/ping", (c) => {
  return c.text("pong", 200);
});

showRoutes(app, {
  verbose: true,
});

export default {
  port: process.env.APP_API_PORT,
  fetch: app.fetch,
};
