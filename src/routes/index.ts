import express from 'express';
import authRouter from './auth';

export const services = express.Router()

services.use('/auth', authRouter)