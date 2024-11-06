import { secret_key } from "../secret";
import authController from "../controllers/auth";
import express from 'express';
var { expressjwt: jwt } = require("express-jwt");
export const authRouter = express.Router();
/*======================== Auth =======================*/

authRouter.route('/login').post(authController.signin)
authRouter.route('/register').post(authController.signup)

export default authRouter
