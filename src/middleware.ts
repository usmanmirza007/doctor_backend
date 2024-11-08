import { Request, Response, NextFunction } from 'express';

import { CustomError, SuccessResponse } from './utils';

export function responseHandler(
  req: Request,
  res: any,
  next: NextFunction
) {
  res.sendResponse = (data: SuccessResponse) => {
    const { status, message, details } = data;
    return res.status(status).json({
      data: {
        status,
        message,
        result: {
          ...details
        },
      }
    });
  };
  next();
}

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
