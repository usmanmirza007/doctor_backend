const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
require('dotenv').config({ path: `env/.env.${NODE_ENV}` });

export const secret_key = {
	algorithms: ['HS256' as const],
	secret: 'JC8KBNT53TXjwqFAFjf3nLSGXmdHmGKZ', // TODO: Put in process.env
};