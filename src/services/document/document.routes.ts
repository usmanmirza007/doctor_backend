import express from 'express';
import documentController from './document.controller';
import multer from 'multer';
import { stroage } from '../../utils';

export const documentRouter = express.Router();
const upload = multer({ storage: stroage }).single('file')
const uploads = multer({ storage: stroage }).array('file', 2)

documentRouter.route('/encrypt_pdf').post(upload, documentController.encryptPDF)
documentRouter.route('/image_to_pdf').post(uploads, documentController.imageToPDF)

export default documentRouter
