
const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
require('dotenv').config({ path: `env/.env.${NODE_ENV}` });
console.log('Running mode:', NODE_ENV);
import mongoose from 'mongoose'

import { init } from "./server";

Promise.resolve()
  .then(() => {
    if (process.env.DB_CONNECTION) {

      mongoose.connect('mongodb://localhost:27017/doctor');
      console.log('Database Connection Succeed', process.env.DB_CONNECTION);

      mongoose.Promise = global.Promise;
    }
    mongoose.connection.on('error', (err: any) => {
      console.log('Database Connection Failed:', err);
    });
    return init();
  })
  .catch((err) => {
    process.exit(1);
  });
