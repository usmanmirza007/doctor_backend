import { ERRORS } from "../consts";
import { NextFunction, Request, Response } from 'express';
import { Auth } from "../models/auth";

const auth = {

  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, userType, } = req.body
      console.log('ogogog', req.body);
      
      if (!name || !password || !email || !userType) {

        return res.status(400).json({ message: 'Incomplete parameter' });
      } else {

        const exsitingUser = await Auth.findOne({ $where: email });
        if (exsitingUser) {
          return res.status(409).json({ message: 'User with email is already register' })
        }

        const user = new Auth({
          email: email,
          userType: userType,
          name: name,
          password: password
        })
        user.save()
        return res.status(200).json({ message: 'User has been register successfully' })
      }

    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong' })
    }
  },

  signin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).send('test')
    }
    catch (err) {
      console.log(ERRORS.SIGN_IN, err)
    }
  },

  forgetPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {

    }
    catch (error) {
      res.status(500).send(ERRORS.UNEXPECTED_ERROR)
    }
  },
}

export default auth