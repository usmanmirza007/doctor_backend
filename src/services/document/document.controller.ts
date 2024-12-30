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

  decryptPDF: async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const document = await documentService.decryptPDF(req, res, next)

    } catch (error) {
      console.log('err', error);

      return res.json(error)
    }
  },

  imageToPDF: async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const document = await documentService.imageToPDF(req, res, next)

    } catch (error) {
      console.log('err', error);

      return res.json(error)
    }
  },

  pdfToWord: async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const document = await documentService.pdfToWord(req, res, next)

    } catch (error) {
      console.log('err', error);

      return res.json(error)
    }
  },

  mergePdf: async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const document = await documentService.mergePdf(req, res, next)

    } catch (error) {
      console.log('err', error);

      return res.json(error)
    }
  },

  csvToJson: async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const document = await documentService.csvToJson(req, res, next)

    } catch (error) {
      console.log('err', error);

      return res.json(error)
    }
  },
  jsonToCsv: async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const document = await documentService.jsonToCsv(req, res, next)

    } catch (error) {
      console.log('err', error);

      return res.json(error)
    }
  },
  excelToJson: async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const document = await documentService.excelToJson(req, res, next)

    } catch (error) {
      console.log('err', error);

      return res.json(error)
    }
  },
  jsonToExcel: async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const document = await documentService.jsonToExcel(req, res, next)

    } catch (error) {
      console.log('err', error);

      return res.json(error)
    }
  },

}

export default documentController