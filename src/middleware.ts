import { Request, Response, NextFunction } from 'express';

import { CustomError } from './utils';

export function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {

  if (err instanceof CustomError) {
    return res.status(err.status).json({
      error: {
        status: err.status,
        message: err.message,
        details: err.details || null,
      },
    });
  }

  // Generic response for unexpected errors
  res.status(500).json({
    error: {
      message: 'Internal Server Error',
    },
  });
}
