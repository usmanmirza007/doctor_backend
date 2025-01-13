import express, { NextFunction, Request, Response } from 'express';
import documentController from './document.controller';
import multer from 'multer';
import { storage } from '../../utils';


export const documentRouter = express.Router();
const upload = multer({ storage: storage }).single('file')
const uploads = multer({ storage: storage }).array('file', 2)

function dynamicFileCount(req: Request, res: Response, next: NextFunction) {
  // Determine the file count dynamically, e.g., from the request body or query
  if (Array.isArray(req.files) && req.files.length) {
    const fileCount = req.files?.length // Default to 2 if not provided
    // Call the multer upload middleware
    const upload = multer({ storage: storage }).array('file', fileCount);
    upload(req, res, function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  } else {
    const upload = multer({ storage: storage }).single('file')
    upload(req, res, function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });

  }
}

documentRouter.route('/encrypt_pdf').post(upload, documentController.encryptPDF)
documentRouter.route('/decrypt_pdf').post(upload, documentController.decryptPDF)
documentRouter.route('/image_to_pdf').post(uploads, documentController.imageToPDF)
documentRouter.route('/pdf_to_word').post(upload, documentController.pdfToWord)
documentRouter.route('/word_to_pdf').post(upload, documentController.wordToPdf)
documentRouter.route('/merge_pdf').post(uploads, documentController.mergePdf)
documentRouter.route('/csv_to_json').post(upload, documentController.csvToJson)
documentRouter.route('/json-to-csv').post(upload, documentController.jsonToCsv)
documentRouter.route('/excel_to_json').post(upload, documentController.excelToJson)
documentRouter.route('/json_to_excel').post(upload, documentController.jsonToExcel)
documentRouter.route('/word_to_txt').post(upload, documentController.wordToTxt)
documentRouter.route('/txt_to_word').post(upload, documentController.txtToWord)
documentRouter.route('/compress_pdf').post(upload, documentController.compressPdf)
documentRouter.route('/excel_pdf').post(upload, documentController.excelToPdf)
documentRouter.route('/pdf-to-excel').post(upload, documentController.pdfToExcel)
documentRouter.route('/image_convert').post(upload, documentController.imageConvert)
documentRouter.route('/spell_checker').post(upload, documentController.spellchecker)
documentRouter.route('/pages_to_convert').post(upload, documentController.pageConvert)
documentRouter.route('/pdf_to_txt').post(upload, documentController.pdfToTxt)
documentRouter.route('/word-to-html').post(upload, documentController.wordToHtml)
documentRouter.route('/pdf-to-html').post(upload, documentController.pdfToHtml)
documentRouter.route('/pdf-to-powerpoint').post(dynamicFileCount, documentController.pdfToPowerPoint)

export default documentRouter
