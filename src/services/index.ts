

import express from 'express';
import { authRouter } from './auth';
import documentRouter from './document/document.routes';

export const services = express.Router();

services.use('/auth', authRouter)
services.use('/document', documentRouter)

export default services
