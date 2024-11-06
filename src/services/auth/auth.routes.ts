import express from 'express';
import authController from './auth.controller';

export const authRouter = express.Router();

authRouter.route('/register').post(authController.signup)
authRouter.route('/login').post(authController.signin)
authRouter.route('/otp').post(authController.createOtp)
authRouter.route('/resendOtp').post(authController.resetOtp)
authRouter.route('/verifyOtp').post(authController.verifyOtp)

export default authRouter
