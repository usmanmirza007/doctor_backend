
import { NextFunction, Response } from 'express';
import nodemailer from 'nodemailer'
var bcrypt = require('bcrypt')
import jwt from 'jsonwebtoken'

import { User } from './auth.model';
import { secret_key } from '../../secret';
import { AuthOTPDto, AuthSinginDto, AuthSingupDto, UserType } from './dto';
import { ConflictError, SuccessResponse, BadRequestError, NotFoundError, UnauthorizedError } from '../../utils';

const authService = {

  signup: async (body: AuthSingupDto, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, userType, number } = body

      if (!name || !password || !email || !userType || !number) {
        throw new BadRequestError('Incomplete parameter');
      } else {
        let type: UserType = userType

        if (type == UserType.DOCTOR) {
          type = UserType.DOCTOR
        } else if (type == UserType.PATIENT) {
          type = UserType.PATIENT
        } else {
          throw new BadRequestError('Invalid user type');
        }
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          throw new ConflictError('User with email is already register');
        }
        let hash = bcrypt.hashSync(password, 8);

        const user = new User({
          email: email,
          userType: userType,
          name: name,
          password: hash,
          number: number
        })
        user.save()
        const success = new SuccessResponse('User has been register successfully');
        return res.status(success.status).json({
          data: {
            status: success.status,
            message: success.message,
          }
        });
      }

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  signin: async (body: AuthSinginDto, res: Response, next: NextFunction) => {
    try {
      const { email, password, userType } = body

      if (!password || !email || !userType) {
        throw new BadRequestError('Incomplete parameter');
      } else {

        let type: UserType = userType

        if (type == UserType.DOCTOR) {
          type = UserType.DOCTOR
        } else if (type == UserType.PATIENT) {
          type = UserType.PATIENT
        } else {
          throw new BadRequestError('Invalid user type');
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
          throw new NotFoundError('User does not exists');
        }
        let matched = bcrypt.compareSync(password, existingUser.password);

        if (matched) {
          const data = await jwt.sign({
            username: email,
            userType: existingUser.userType,
            id: existingUser.id,
          }, secret_key.secret, {
            expiresIn: '4h',
            algorithm: secret_key.algorithms[0]
          });

          const success = new SuccessResponse('User has been login successfully',);
          return res.status(success.status).json({
            data: {
              status: success.status,
              message: success.message,
              token: data
            }
          });

        } else {
          throw new UnauthorizedError('Incorrect credentials');
        }
      }

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  createOtp: async (body: AuthOTPDto, res: Response, next: NextFunction) => {
    try {
      const { email } = body

      if (!email) {
        throw new BadRequestError('Request should have email');
      }
      const existingUser = await User.findOne({ email });

      const rundomOTP = Math.floor(100000 + Math.random() * 9000)
      const mailerConfig = {
        service: 'gmail',
        secure: true,
        port: 465,
        // debug: true,
        auth: {
          user: "pureworkerapp@gmail.com",
          pass: "mphtgdqcapmvmyll"
        }
      };

      const transporter = nodemailer.createTransport(mailerConfig);

      const mailOptions = {
        from: mailerConfig.auth.user,
        to: existingUser?.email,
        subject: "Doctor",
        // attachments: [
        //     {
        //         filename: 'badge_code.txt',
        //         content: String('123')0
        //     }],
        html: `<body>` +
          `<p style="font-size: 1rem">Your OTP: <span style="font-weight: bold; font-size: 1rem">${rundomOTP}</span></p>` +
          `</body>`
      };

      transporter.sendMail(mailOptions, async function (error: any, info: any) {

        if (error) {
          console.log('mail error', error);
          next(error)
        } else {
          const existingUser = await User.findOneAndUpdate({ email }, { otp: rundomOTP });
          const success = new SuccessResponse('Email has been sent successfully',);
          return res.status(success.status).json({
            data: {
              status: success.status,
              message: success.message
            }
          });

        }
      });


    } catch (error) {
      console.log('err 33', error);
      next(error)
    }
  },

  resetOtp: async (body: AuthOTPDto, res: Response, next: NextFunction) => {
    const { email } = body

    if (!email) {
      throw new BadRequestError('Request should have email');
    }
    try {

      const existingUser = await User.findOneAndUpdate({ email }, { otp: null });
      const success = new SuccessResponse('OTP has expired');
      return res.status(success.status).json({
        data: {
          status: success.status,
          message: success.message
        }
      });

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },


  verifyOtp: async (data: AuthOTPDto, res: Response, next: NextFunction) => {
    const { email, otp } = data

    if (!email || !otp) {
      throw new BadRequestError('Incomplet Parameter');
    } else {
      try {

        const user = await User.findOne({ email });

        if (user) {
          
          if (otp != null && user.otp === otp) {
            const data = await jwt.sign({
              username: email,
              UserType: user.userType,
              id: user.id,
            }, secret_key.secret, {
              expiresIn: '365d',
              algorithm: secret_key.algorithms[0]
            });

            const success = new SuccessResponse('User has been verifed successfully',);
            return res.status(success.status).json({
              data: {
                status: success.status,
                message: success.message,
                token: data
              }
            });
          } else {
            throw new BadRequestError('OTP does not match');
          }
        } else {
          throw new NotFoundError('User not found');
        }
      } catch (error) {
        console.log('err', error)
        next(error)
      }
    }
  }

}

export default authService
