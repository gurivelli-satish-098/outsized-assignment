/**
 * Base error class for all application errors.
 * Extends the native Error class and adds status code functionality.
 */
export class BaseError extends Error {
  /** HTTP status code for the error */
  statusCode: number;

  /**
   * Create a new BaseError instance.
   * @param {string} message - Error message
   * @param {number} [statusCode=500] - HTTP status code
   */
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = new.target.name;
    Error.captureStackTrace(this, new.target);
  }
}

/**
 * Error thrown when authentication fails.
 * Used for invalid credentials, missing tokens, etc.
 */
export class AuthenticationError extends BaseError {
  /**
   * Create a new AuthenticationError instance.
   * @param {string} [message="Authentication failed"] - Error message
   */
  constructor(message = "Authentication failed") {
    super(message, 401);
  }
}

/**
 * Error thrown when user lacks permission to access a resource.
 * Used for role-based access control violations.
 */
export class AuthorizationError extends BaseError {
  /**
   * Create a new AuthorizationError instance.
   * @param {string} [message="Not authorized to access this resource"] - Error message
   */
  constructor(message = "Not authorized to access this resource") {
    super(message, 403);
  }
}

/**
 * Error thrown when input validation fails.
 * Used for invalid request data, missing required fields, etc.
 */
export class ValidationError extends BaseError {
  /**
   * Create a new ValidationError instance.
   * @param {string} [message="Validation failed"] - Error message
   */
  constructor(message = "Validation failed") {
    super(message, 400);
  }
}

/**
 * Error thrown when a requested resource is not found.
 * Used for 404 responses when entities don't exist.
 */
export class NotFoundError extends BaseError {
  /**
   * Create a new NotFoundError instance.
   * @param {string} [message="Resource not found"] - Error message
   */
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

/**
 * Error thrown for internal server errors.
 * Used for unexpected application errors, database failures, etc.
 */
export class InternalError extends BaseError {
  /**
   * Create a new InternalError instance.
   * @param {string} [message="Internal server error"] - Error message
   */
  constructor(message = "Internal server error") {
    super(message, 500);
  }
}

/**
 * Error thrown for unauthorized access attempts.
 * Similar to AuthenticationError but specifically for access control.
 */
export class UnauthorizedError extends BaseError {
  /**
   * Create a new UnauthorizedError instance.
   * @param {string} [message="Unauthorized access"] - Error message
   */
  constructor(message = "Unauthorized access") {
    super(message, 401);
  }
}
