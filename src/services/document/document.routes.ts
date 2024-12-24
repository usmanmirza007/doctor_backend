import express from 'express';
import documentController from './document.controller';

export const documentRouter = express.Router();

documentRouter.route('/encrpt').post(documentController.signup)

export default documentRouter
