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

export default documentRouter
