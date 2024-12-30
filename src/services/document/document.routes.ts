import express from 'express';
import documentController from './document.controller';
import multer from 'multer';
import { stroage } from '../../utils';

export const documentRouter = express.Router();
const upload = multer({ storage: stroage }).single('file')
const uploads = multer({ storage: stroage }).array('file', 2)

documentRouter.route('/encrypt_pdf').post(upload, documentController.encryptPDF)
documentRouter.route('/decrypt_pdf').post(upload, documentController.decryptPDF)
documentRouter.route('/image_to_pdf').post(uploads, documentController.imageToPDF)
documentRouter.route('/pdf_to_word').post(uploads, documentController.pdfToWord)
documentRouter.route('/merge_pdf').post(uploads, documentController.mergePdf)
documentRouter.route('/csv_to_json').post(upload, documentController.csvToJson)
documentRouter.route('/json-to-csv').post(upload, documentController.jsonToCsv)
documentRouter.route('/excel_to_json').post(upload, documentController.excelToJson)
documentRouter.route('/json_to_excel').post(upload, documentController.jsonToExcel)

export default documentRouter
