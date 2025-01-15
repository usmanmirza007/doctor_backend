import { Request } from "express";
import { UnauthorizedError } from "./customError";

import jwt from 'jwt-simple';
import { serialize, parse } from 'cookie';


const jwtSectetKey = process.env.JWT_SECRET_KEY ? process.env.JWT_SECRET_KEY : ''

export const tokenModule = {
  generateToken: function (user: any, resetPassword = false) {
    delete user['password'];
    // delete user['salt'];
    // delete user['resetToken'];
    const token = jwt.encode({
      sub: user,
      iat: 2592000,
      exp: resetPassword ? Math.floor(Date.now() / 1000) + 60 : undefined
    }, jwtSectetKey);
    try {
      tokenModule.setTokenCookie(token, true);
    } catch (error) {
      console.log('Generate Token Error:', error);
    }
    return token;
  },
  verifyToken: function (token: string) {
    try {
      const decode = jwt.decode(token, jwtSectetKey);
      return decode;
    } catch (e) {
      throw new UnauthorizedError('Token is not verified.');
    }
  },
  // getToken: () => {
  //   return new Cookies().get(Constants.TOKEN);
  // },
  getTokenExpires(token: string) {
    let expires;
    try {
      const verifiedToken = tokenModule.verifyToken(token);

      expires = new Date(verifiedToken.iat);
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
  }
};
