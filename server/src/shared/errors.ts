import * as HttpStatusCode from "@shared/enums";

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode = HttpStatusCode.InternalServerError,
    public details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

// Specific error types

export class NonUniqueEmail extends AppError {
  constructor(message = "Email must be unique") {
    super(message, HttpStatusCode.BadRequest);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, HttpStatusCode.NotFound);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, HttpStatusCode.Unauthorized);
  }
}

export class InvalidTokenError extends AuthenticationError {
  constructor(message = "Invalid token") {
    super(message);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: unknown) {
    super(message, HttpStatusCode.BadRequest, details);
  }
}
