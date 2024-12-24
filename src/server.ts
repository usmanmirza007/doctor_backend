const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
require('dotenv').config({ path: `env/.env.${NODE_ENV}` });

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import http from "http";
import multer from 'multer'
import services from "./services";
import { errorHandler, responseHandler } from "./middleware";
import path from "path";
let {spawn} = require('child_process')
const app = express();

var stroage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'src/public/uploads')
  },
  filename: function (req, file, cb) {
    console.log('file', file.originalname);
    
    cb(null, Date.now() +file.originalname)
  }
})

var upload = multer({storage: stroage}).single('file')

export async function init() {
  const PORT = process.env.PORT;
  console.log('PORT', PORT);
  
  const allowedOrigins = [
    'http://localhost:8081'
  ];

  if (NODE_ENV === 'development') {
    allowedOrigins.push('http://localhost:8081', 'http://localhost:8081');
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
  app.use(express.static('src/public'))

  app.post('/encryptedpdf', (req, res, ) => {
    console.log('fofofof');

    upload(req, res, (err) => {
      if (err) {
        console.log('err file', err);
        
      }
      // console.log('sososos', req.file, req.body.password);
      // let outputfile = Date.now() + "output.pdf"
      // let outputfile = path.join(__dirname, `${Date.now()}_output.pdf`);
      
      let password = req.body.password
      
      if (req.file) {
        let outputfile = req.file.path
        console.log('outputfile', req.file.path, outputfile);
        // src/public/uploads/cardio1.pdf 
        let process = spawn('python', ["app.py", req.file.path, outputfile, password ])

        process.on('exit', (code: any) => {
          console.log('code', code);
          
          // if (code == 0) {
            res.download(outputfile, (err) => {
              console.log('err', err);
              
            })
          // }
        })
      }
    })
  })
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
