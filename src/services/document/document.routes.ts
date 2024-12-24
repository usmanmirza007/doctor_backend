import express from 'express';
import documentController from './document.controller';
import multer from 'multer';
import { stroage } from '../../utils';

export const documentRouter = express.Router();
const upload = multer({ storage: stroage }).single('file')

documentRouter.route('/encrypt_pdf').post(upload, documentController.encryptPDF)

export default documentRouter
