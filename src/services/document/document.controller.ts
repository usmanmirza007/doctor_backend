import { NextFunction, Request, Response } from 'express';
import documentService from './document.service';
;

const documentController = {

  encryptPDF: async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const document = await documentService.encryptPDF(req, res, next)

    } catch (error) {
      console.log('err', error);

      return res.json(error)
    }
  },

}

export default documentController