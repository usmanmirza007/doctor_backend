
import { NextFunction, Response } from 'express';

let { exec } = require('child_process')
import PDFMerger from 'pdf-merger-js'
import fs from 'fs';

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

  imageToPDF: async (req: any, res: any, next: NextFunction) => {
    try {

      if (req.files) {

        const filePathsArg = req.files.map((item: any) => item.path)
        const inputFilePath = filePathsArg.join(' ');
        const outputFilePath = `src/public/uploads/${Date.now()}.pdf`; // Output file
        exec(`python src/services/document/python/imageToPdf.py ${outputFilePath} ${inputFilePath}`, (error: any, stdout: any, stderr: any) => {
          if (error) {
            console.error(`Error executing Python script: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
          }

          console.log(`Python script output: ${stdout}`);
          // Delete the uploaded image files after PDF generation
          filePathsArg.forEach((filePath: string) => {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`Error deleting file ${filePath}: ${err.message}`);
              } else {
                console.log(`Deleted file: ${filePath}`);
              }
            });
          });
        });
      }

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },


  mergePdf: async (req: any, res: any, next: NextFunction) => {
    try {

      if (req.files) {

        const filePathsArg = req.files.map((item: any) => item.path)
        const outputFilePath = `src/public/uploads/merge_${Date.now()}.pdf`; // Output file

        const merger = new PDFMerger(); // Create merger instance

        try {
          // Append each PDF file
          for (let file of filePathsArg) {
            await merger.add(file); // Add PDF file to merger
          }

          await merger.save(outputFilePath);

          console.log('PDF files merged successfully into:', outputFilePath);
        } catch (error) {
          console.error('Error merging PDF files:', error);
        }

      }

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },


}

export default documentService
