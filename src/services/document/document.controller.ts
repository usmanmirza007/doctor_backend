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

  wordToPdf: async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const document = await documentService.wordToPdf(req, res, next)

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

  wordToTxt: async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const document = await documentService.wordToTxt(req, res, next)

    } catch (error) {
      console.log('err', error);

      return res.json(error)
    }
  },

  txtToWord: async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const document = await documentService.txtToWord(req, res, next)

    } catch (error) {
      console.log('err', error);

      return res.json(error)
    }
  },

  compressPdf: async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const document = await documentService.compressPdf(req, res, next)

    } catch (error) {
      console.log('err', error);

      return res.json(error)
    }
  },

  excelToPdf: async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const document = await documentService.excelToPdf(req, res, next)

    } catch (error) {
      console.log('err', error);

      return res.json(error)
    }
  },

  pdfToExcel: async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const document = await documentService.pdfToExcel(req, res, next)

    } catch (error) {
      console.log('err', error);

      return res.json(error)
    }
  },

  imageConvert: async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const document = await documentService.imageConvert(req, res, next)

    } catch (error) {
      console.log('err', error);

      return res.json(error)
    }
  },

  spellchecker: async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const document = await documentService.spellchecker(req, res, next)

    } catch (error) {
      console.log('err', error);

      return res.json(error)
    }
  },

  pageConvert: async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const document = await documentService.pageConvert(req, res, next)

    } catch (error) {
      console.log('err', error);

      return res.json(error)
    }
  },

  mergeWord: async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const document = await documentService.mergeWord(req, res, next)

    } catch (error) {
      console.log('err', error);

      return res.json(error)
    }
  },

  pdfToTxt: async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const document = await documentService.pdfToTxt(req, res, next)

    } catch (error) {
      console.log('err', error);

      return res.json(error)
    }
  },

  wordToHtml: async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const document = await documentService.wordToHtml(req, res, next)

    } catch (error) {
      console.log('err', error);

      return res.json(error)
    }
  },
  
}

export default documentController