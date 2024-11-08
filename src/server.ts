const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
require('dotenv').config({ path: `env/.env.${NODE_ENV}` });

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import http from "http";

import services from "./services";
import { errorHandler, responseHandler } from "./middleware";

const app = express();

export async function init() {
  const PORT = process.env.PORT;

  const allowedOrigins = [
    'http://localhost:8083'
  ];

  if (NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:8083', 'http://localhost:8083');
  }

  const corsOptions = {
    // origin: (origin, callback) => {
    //   if (allowedOrigins.includes(origin) || !origin) {
    //     callback(null, true);
    //   } else {
    //     callback(new Error(ERRORS.CORS_NOT_ALLOWED));
    //   }
    // },
    origin: '*',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,Origin,Accept,Content-Security-Policy',
  };
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(cors(corsOptions));

  app.use(helmet());
  app.use((req, res, next) => {
    if (req.originalUrl === '/api/webhooks') {
      next();
    } else {
      bodyParser.json({
        limit: '20mb',
      })(req, res, next); // ONLY do bodyParser.json() if the received request is NOT a WebHook from Stripe.
    }
  });
  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );

  app.use(cookieParser());

  app.use(function (req, res, next) {

    const origin = req.headers.origin || '';
    // if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // }
    res.setHeader(
      'Access-Control-Allow-Headers',
      'content-type, authorization, origin, accept',
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'POST, GET, DELETE, PUT, OPTIONS',
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    // }
    next();
  });
  app.use(responseHandler);

  app.use('/api', services);


  app.get('/healthcheck', (req, res) => {
    res.sendStatus(200);
  });
  app.use(errorHandler);

  const httpServer = http.createServer(app);
  var server = httpServer.listen(PORT, () => {
    console.log(`We have a ${NODE_ENV} server running on PORT: ${PORT}`);
  });
}
