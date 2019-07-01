/**
 * Unauthorized error.
 */
export class UnauthorizedError extends Error {
  public readonly status: number;

  public constructor(message?: string) {
    super();
    this.status = 403;
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
    this.status = 401;
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
    this.status = 409;
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
    this.status = 500;
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
    this.status = 400;
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

    this.status = 422;
    this.name = this.constructor.name;
    this.message = message;
    this.errors = error.details && Array.isArray(error.details) ? error.details.map((d: any) => d.message) : [];

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * NotFound error.
 */
export class NotFoundError extends Error {
  public readonly status: number;

  public constructor(message?: string) {
    super();
    this.status = 404;
    this.name = this.constructor.name;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }
}
