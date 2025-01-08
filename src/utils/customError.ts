
export class CustomError extends Error {
  public status: number;
  public details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.status = status;
    this.details = details;

    // Ensures this class is properly recognized as an error
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

export class SuccessResponse extends CustomError {
  constructor(message = 'Request successful', details?: any) {
    super(message, 200, details);
  }
}

export class BadRequestError extends CustomError {
  constructor(message = 'Validation error', details?: any) {
    super(message, 400, details);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized access', details?: any) {
    super(message, 401, details);
  }
}

export class NotFoundError extends CustomError {
  constructor(message = 'Resource not found', details?: any) {
    super(message, 404, details);
  }
}

export class ConflictError extends CustomError {
  constructor(message = 'Conflict occurred', details?: any) {
    super(message, 409, details);
  }
}

export class InternalServerError extends CustomError {
  constructor(message = 'Internal server error', details?: any) {
    super(message, 500, details);
  }
}
