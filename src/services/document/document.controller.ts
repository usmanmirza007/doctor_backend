import { NextFunction, Request, Response } from 'express';
import documentService from './document.service';
;

const documentController = {

  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await documentService.signup(req.body, res, next)

    } catch (error) {
      console.log('err', error);

      return res.json(error)
    }
  },

}

export default documentController