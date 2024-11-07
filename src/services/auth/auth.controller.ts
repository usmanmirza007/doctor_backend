import { NextFunction, Request, Response } from 'express';

import authService from './auth.service';

const authController = {

  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.signup(req.body, res, next)

    } catch (error) {
      console.log('err', error);

      return res.json(error)
    }
  },

  signin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.signin(req.body, res, next)

    } catch (err) {
      console.log('err', err)
    }
  },

  createOtp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const otp = await authService.createOtp(req.body, res, next)

    } catch (error) {
      console.log('err', error)
      return res.json(error)

    }
  },


  resetOtp: async (req: Request, res: Response, next: NextFunction) => {

    try {
      const resetOtp = await authService.resetOtp(req.body, res, next)

    } catch (error) {
      console.log('err', error);
      return res.status(500).json(error)
    }
  },

  verifyOtp: async (req: Request, res: Response, next: NextFunction) => {

    try {
      const verifyOtp = await authService.verifyOtp(req.body, res, next)

    } catch (error) {
      console.log('err', error)
      return res.status(500).json({ message: "Something went erong" })
    }

  },

}

export default authController