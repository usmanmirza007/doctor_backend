import { Request, Response, NextFunction } from 'express';

import { CustomError, SuccessResponse, tokenModule, UnauthorizedError } from './utils';

// const { profileDal } = require('./dal/index');

export interface UserRequest extends Request {
  userPayload: any
  user: any
}

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

const ignoredRoutes = [
  '/auth',
]

export const addReqUser = async (request: Request, res: Response, next: NextFunction) => {
  const req = request as UserRequest;

  if (req.userPayload) {
    const user = req.userPayload;
    // return profileDal
    //   .getOneByEmail(user.sub.email)
    //   .then((profile: any) => {
    //     return profile;
    //   })
    //   .then((profile: any) => {
    //     req.user = profile;
    //     next();
    //   })
    //   .catch(() => {
    //     req.user = undefined;
    //     next();
    //   });
  }
  next();
}

export const jwtAuth = (request: Request, res: Response, next: NextFunction) => {
  const req = request as UserRequest;

  if (req.method == 'GET' || ignoredRoutes.includes(req.path)) {
    return next();
  }

  const authStr = req.header('Authorization');
  if (authStr) {
    const token = authStr.split(' ')[1];
    const user = tokenModule.verifyToken(token);
    if (user) {
      req.userPayload = user;
      const cookie = tokenModule.setTokenCookie(token);
      res.setHeader('Set-Cookie', cookie);
      return next();
    }
  } else {
    throw new UnauthorizedError('Unauthorized');
  }

  const token = tokenModule.getTokenFromCookie(req);
  if (token) {
    const user = tokenModule.verifyToken(token);
    if (user) {
      req.userPayload = user;
    }
  } else {
    throw new UnauthorizedError('Unauthorized');
  }
  next();
};

