import { HttpStatusCodes } from '../config/http-status-codes';

/**
 * Unauthorized error.
 */
export class UnauthorizedError extends Error {
  public readonly status: number;

  public constructor(message?: string) {
    super();
    this.status = HttpStatusCodes.Forbidden;
    this.name = this.constructor.name;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Unauthenticated error.
 */
export class UnauthenticatedError extends Error {
  public readonly status: number;

  public constructor(message?: string) {
    super();
    this.status = HttpStatusCodes.Unauthorized;
    this.name = this.constructor.name;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Conflict error.
 */
export class ConflictError extends Error {
  public conflicts: string[];
  public readonly status: number;

  public constructor(conflicts: string[], message?: string) {
    super();
    this.status = HttpStatusCodes.Conflict;
    this.name = this.constructor.name;
    this.message = message;
    this.conflicts = conflicts;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Internal system error.
 */
export class InternalServerError extends Error {
  public readonly status: number;
  public error: any;
  
  public constructor(message?: string, error?: any) {
    super();
    this.status = HttpStatusCodes.InternalServerError;
    this.name = this.constructor.name;
    this.message = message;
    this.error = error;
 
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Bad request error.
 */
export class BadRequestError extends Error {
  public readonly status: number;

  public constructor(message?: string) {
    super();
    this.status = HttpStatusCodes.BadRequest;
    this.name = this.constructor.name;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error.
 */
export class ValidationError extends Error {
  public errors: string[];
  public readonly status: number;

  public constructor(message?: string, error?: any) {
    super();

    this.status = HttpStatusCodes.UnprocessableEntity;
    this.name = this.constructor.name;
    this.message = message;
    this.errors = error.details && Array.isArray(error.details) ? error.details.map((d: any) => d.message) : [];

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Rate limit exceeded error.
 */
export class RateLimitExceededError extends Error {
  public readonly status: number;

  public constructor(message?: string) {
    super();
    this.status = HttpStatusCodes.TooManyRequests;
    this.name = this.constructor.name;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Not found error.
 */
export class NotFoundError extends Error {
  public readonly status: number;

  public constructor(message?: string) {
    super();
    this.status = HttpStatusCodes.NotFound;
    this.name = this.constructor.name;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Internal OAuth error.
 */
export class InternalOAuthError extends Error {
  public readonly status: number;
  public data: string;

  public constructor(status: number = 500, message?: string, data?: any) {
    super();
    this.status = status;
    this.name = this.constructor.name;
    this.message = message;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
}
