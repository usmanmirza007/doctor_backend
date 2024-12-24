
import { NextFunction, Response } from 'express';

var bcrypt = require('bcrypt')

import { ConflictError, SuccessResponse, BadRequestError, NotFoundError, UnauthorizedError } from '../../utils';

const documentService = {

  signup: async (body: any, res: any, next: NextFunction) => {
    try {
      const { name, email, password, userType, number } = body

      

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },


}

export default documentService
