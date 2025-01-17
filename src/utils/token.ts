import { Request } from "express";
import { UnauthorizedError } from "./customError";
import { serialize, parse } from 'cookie';
import { JwtPayload, verify, sign } from 'jsonwebtoken'

const jwtSectetKey = process.env.JWT_SECRET_KEY ? process.env.JWT_SECRET_KEY : ''

export const tokenModule = {

  generateToken: function (user: any, resetPassword = false) {

    delete user['password'];

    const token = sign({
      username: user?.email,
      userType: user.userType,
      id: user.id,
    }, jwtSectetKey, {
      expiresIn: Math.floor(Date.now() / 1000) + 60 * 60,
      algorithm: 'HS256'
    });
    try {
      tokenModule.setTokenCookie(token, true);
    } catch (error) {
      console.log('Generate Token Error:', error);
    }
    return token;
  },

  verifyToken: function (token: string): JwtPayload {
    try {
      const decoded = verify(token, jwtSectetKey, { algorithms: ['HS256'] })
      return decoded as JwtPayload
    } catch (e) {
      throw new UnauthorizedError('Token is not verified.');
    }
  },

  // getToken: () => {
  //   return new Cookies().get(Constants.TOKEN);
  // },

  getTokenExpires(token: string): Date {
    let expires: Date
    try {
      const verifiedToken = tokenModule.verifyToken(token);

      if (verifiedToken.exp) {
        expires = new Date(verifiedToken.exp * 1000); // Convert `exp` to milliseconds
        if (Date.now() > expires.getTime()) {
          throw new Error('Token has expired');
        }
      } else {
        throw new Error('Token does not have an expiration');
      }

    } catch (err) {
      expires = new Date();
    }
    return expires;
  },

  // removeToken: () => {
  //   new Cookies().remove('token', { path: '/' });
  // },

  getTokenFromCookie(req: Request) {
    const cookie = req.headers.cookie;
    const cookies = parse(cookie || '');
    return cookies['token'];
  },

  setTokenCookie: (token: string, newToken?: boolean) => {
    let expires = new Date(2592000);
    if (!newToken) {
      expires = tokenModule.getTokenExpires(token);
    }
    const cookie = serialize('token', token, {
      expires,
      httpOnly: false,
      path: '/',
      sameSite: 'lax',
      secure: false,
    });
    return cookie;
  },

};
