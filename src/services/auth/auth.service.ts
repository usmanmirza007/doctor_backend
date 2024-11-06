
import { User } from './auth.model';
import { createCustomError } from '../utils/customError';
import { AuthOTPDto, AuthSinginDto, AuthSingupDto } from './dto';
var bcrypt = require('bcrypt')
import jwt from 'jsonwebtoken'
import { secret_key } from '../../secret';
import nodemailer from 'nodemailer'

const authService = {

  signup: async (body: AuthSingupDto) => {
    try {
      const { name, email, password, userType, } = body

      if (!name || !password || !email || !userType) {

        throw createCustomError('Incomplete parameter', 400)
      } else {

        const existingUser = await User.findOne({ email });

        if (existingUser) {
          throw createCustomError('User with email is already register', 409)

        }
        let hash = bcrypt.hashSync(password, 8);

        const user = new User({
          email: email,
          userType: userType,
          name: name,
          password: hash
        })
        user.save()
        throw createCustomError('User has been register successfully', 200)

      }

    } catch (error) {
      console.log('err', error);
      throw createCustomError('Something went wrong', 500)
    }
  },

  signin: async (body: AuthSinginDto) => {
    try {
      const { email, password, userType } = body

      if (!password || !email || !userType) {

        throw createCustomError('Incomplete parameter', 400)
      } else {

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
          throw createCustomError('User does not exists', 404)
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

          return {
            token: data
          }

        } else {
          throw createCustomError('Incorrect credentials', 401)

        }
      }

    } catch (error) {
      console.log('err', error);
      throw createCustomError('Something went wrong', 500)
    }
  },

  createOtp: async (email: string) => {
    try {

      if (!email) {
        throw createCustomError('Request should have email', 400)
      }
      try {
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
            throw createCustomError(error, 500)

          } else {
            const existingUser = await User.findOneAndUpdate({ email }, { otp: rundomOTP });
            throw createCustomError('success', 200)
          }
        });

      } catch (error) {
        console.log('err', error);
        throw createCustomError('Something went wrong', 500)
      }
    } catch (error) {
      console.log('err', error);
      throw createCustomError('Something went wrong', 500)
    }
  },

  resetOtp: async (email: string) => {

    if (!email) {
      throw createCustomError('Request should have email', 400)
    }
    try {

      const existingUser = await User.findOneAndUpdate({ email }, { otp: 0 });
      throw createCustomError('success', 200)

    } catch (error) {
      console.log('err', error);
      throw createCustomError(JSON.stringify(error), 500)
    }
  },


  verifyOtp: async (data: AuthOTPDto) => {
    const { email, otp } = data

    if (!email || !otp) {
      throw createCustomError('Incomplet Parameter', 400)
    } else {
      try {

        const user = await User.findOne({ email });

        if (user) {
          if (user.otp === otp) {
            const data = await jwt.sign({
              username: email,
              UserType: user.userType,
              id: user.id,
            }, secret_key.secret, {
              expiresIn: '365d',
              algorithm: secret_key.algorithms[0]
            });

            return {
              token: data,
              userType: user.userType
            }
          } else {
            throw createCustomError('OTP does not match', 400)
          }
        } else {
          throw createCustomError('User not found', 404)
        }
      } catch (error) {
        console.log('err', error)
        throw createCustomError('Something went erong', 500)

      }
    }
  }

}

export default authService
