
import { NextFunction, Response } from 'express';

let { exec } = require('child_process')

import path from 'path'

const documentService = {

  encryptPDF: async (req: any, res: any, next: NextFunction) => {
    try {
      const { password } = req.body

      if (req.file) {
        let outputfile = req.file.path
        exec(`python src/services/document/python/encryptPdf.py ${outputfile} ${outputfile} ${password}`, (error: any, stdout: any, stderr: any) => {
          if (error) {
            console.error(`Error executing Python script: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
          }
          console.log(`Python script output: ${stdout}`);
        });
      }

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },


}

export default documentService
