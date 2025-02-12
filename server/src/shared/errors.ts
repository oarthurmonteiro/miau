export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode = 500,
    public details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

// Specific error types

export class NonUniqueEmail extends AppError {
  constructor(message = "Email must be unique") {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: unknown) {
    super(message, 400, details);
  }
}
