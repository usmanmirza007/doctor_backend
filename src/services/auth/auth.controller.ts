import { NextFunction, Request, Response } from 'express';
import authService from './auth.service';
import { ERRORS } from '../../consts';

const authController = {

  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.signup(req.body)
    } catch (error) {
      console.log('err', error);

      return res.status(500).json({ message: 'Something went wrong' })
    }
  },

  signin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.signin(req.body)

    } catch (err) {
      console.log(ERRORS.SIGN_IN, err)
    }
  },

  createOtp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const otp = await authService.createOtp(req.body)

    } catch (err) {
      console.log(ERRORS.SIGN_IN, err)
    }
  },


  resetOtp: async (req: Request, res: Response) => {

    try {
      const resetOtp = await authService.resetOtp(req.body)

    } catch (error) {
      console.log('err', error);
      return res.status(500).json(error)
    }
  },

  verifyOtp: async (req: Request, res: Response) => {

    try {
      const verifyOtp = await authService.verifyOtp(req.body)

    } catch (error) {
      console.log('dff', error)
      return res.status(500).json({ message: "Something went erong" })
    }

  },

  forgetPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {

    } catch (error) {
      res.status(500).send(ERRORS.UNEXPECTED_ERROR)
    }
  },
}

export default authController