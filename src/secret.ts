const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
require('dotenv').config({ path: `env/.env.${NODE_ENV}` });

export const secret_key = {
	algorithms: ['HS256' as const],
	secret: process.env.JWT_SECRET ? process.env.JWT_SECRET : '', // TODO: Put in process.env
};