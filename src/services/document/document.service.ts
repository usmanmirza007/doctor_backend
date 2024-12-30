
import { NextFunction, Response } from 'express';

let { exec } = require('child_process')
import PDFMerger from 'pdf-merger-js'
import fs from 'fs';
import path from 'path';
import csv from 'csvtojson'
import { Parser } from 'json2csv'
import xlsx from 'xlsx'

const documentService = {

  encryptPDF: async (req: any, res: any, next: NextFunction) => {
    try {
      const { password } = req.body

      if (req.file) {
        let inputfile = req.file.path
        let outputfile = `src/public/uploads/encrpt_${Date.now()}.pdf`;
        exec(`python src/services/document/python/encryptPdf.py ${inputfile} ${outputfile} ${password}`, (error: any, stdout: any, stderr: any) => {
          if (error) {
            console.error(`Error executing Python script: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
          }
          console.log(`Python script output: ${stdout}`);
          fs.unlink(inputfile, (err) => {
            if (err) {
              console.error(`Error deleting file ${inputfile}: ${err.message}`);
            } else {
              console.log(`Deleted file: ${inputfile}`);
            }
          });
        });
      }

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  decryptPDF: async (req: any, res: any, next: NextFunction) => {
    try {
      const { password } = req.body

      if (req.file) {
        let inputfile = req.file.path
        let outputfile = `src/public/uploads/decrpt_${Date.now()}.pdf`;
        exec(`python src/services/document/python/decryptPdf.py ${inputfile} ${outputfile} ${password}`, (error: any, stdout: any, stderr: any) => {
          if (error) {
            console.error(`Error executing Python script: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
          }
          console.log(`Python script output: ${stdout}`);
          fs.unlink(inputfile, (err) => {
            if (err) {
              console.error(`Error deleting file ${inputfile}: ${err.message}`);
            } else {
              console.log(`Deleted file: ${inputfile}`);
            }
          });
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

  pdfToWord: async (req: any, res: any, next: NextFunction) => {
    try {

      if (req.files) {

        const filePathsArg = req.files.map((item: any) => item.path)
        const inputFilePath = filePathsArg.join(' ');
        // const inputFilePath = 'src/public/uploads/cardio.pdf';
        const outputFilePath = `src/public/uploads/${Date.now()}.docx`; // Output file
        // exec(`python src/services/document/python/pdfToWord.py ${inputFilePath} ${outputFilePath}`, (error: any, stdout: any, stderr: any) => {
        //   if (error) {
        //     console.error(`Error executing Python script: ${error.message}`);
        //     return;
        //   }
        //   if (stderr) {
        //     console.error(`stderr: ${stderr}`);
        //     return;
        //   }

        //   console.log(`Python script output: ${stdout}`);
        //   // Delete the uploaded image files after PDF generation
        //   filePathsArg.forEach((filePath: string) => {
        //     fs.unlink(filePath, (err) => {
        //       if (err) {
        //         console.error(`Error deleting file ${filePath}: ${err.message}`);
        //       } else {
        //         console.log(`Deleted file: ${filePath}`);
        //       }
        //     });
        //   });
        // });
        // Check if input PDF exists
        if (!fs.existsSync(inputFilePath)) {
          console.error(`Error: Input PDF file '${inputFilePath}' does not exist.`);
          process.exit(2);
        }

        // Use 'pdf-poppler' to convert PDF to Word
        const inputPath = path.resolve(inputFilePath); // Absolute path for input
        const outputPath = path.resolve(outputFilePath); // Absolute path for output

        // Read the PDF file
        const dataBuffer = fs.readFileSync(inputFilePath);

        // Convert PDF to Word
        // const result = await pdf2word(dataBuffer);
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

  csvToJson: async (req: any, res: any, next: NextFunction) => {
    try {

      if (req.file) {

        const inputCsvPath = req.file.path
        const outputFilePath = `src/public/uploads/json_${Date.now()}.json`; // Output file

        try {
          // Check if input CSV exists
          if (!fs.existsSync(inputCsvPath)) {
            console.error(`Error: Input CSV file '${inputCsvPath}' does not exist.`);
          }

          // Convert CSV to JSON
          const jsonArray = await csv().fromFile(inputCsvPath);

          // Write JSON to output file
          fs.writeFileSync(outputFilePath, JSON.stringify(jsonArray, null, 2));
          // Delete file
          fs.unlink(inputCsvPath, (err) => {
            if (err) {
              console.error(`Error deleting file ${inputCsvPath}: ${err.message}`);
            } else {
              console.log(`Deleted file: ${inputCsvPath}`);
            }
          });

          console.log(`CSV successfully converted to JSON: ${outputFilePath}`);
        } catch (error) {
          console.error(`An error occurred during conversion: ${error}`);
        }
      }

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  jsonToCsv: async (req: any, res: any, next: NextFunction) => {
    try {

      if (req.file) {

        const inputJsonPath = req.file.path
        const outputFilePath = `src/public/uploads/csv_${Date.now()}.csv`; // Output file

        try {
          // Check if input JSON file exists
          if (!fs.existsSync(inputJsonPath)) {
            console.error(`Error: Input JSON file '${inputJsonPath}' does not exist.`);
            process.exit(2);
          }

          // Read JSON data from file
          const jsonData = JSON.parse(fs.readFileSync(inputJsonPath, 'utf8'));

          // Convert JSON to CSV
          const parser = new Parser(); // Create a parser instance
          const csv = parser.parse(jsonData);

          // Write CSV to output file
          fs.writeFileSync(outputFilePath, csv);
          console.log(`JSON successfully converted to CSV: ${outputFilePath}`);
          fs.unlink(inputJsonPath, (err) => {
            if (err) {
              console.error(`Error deleting file ${inputJsonPath}: ${err.message}`);
            } else {
              console.log(`Deleted file: ${inputJsonPath}`);
            }
          });
        } catch (error) {
          console.error(`An error occurred during conversion: ${error}`);
          // process.exit(2);
        }
      }

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  jsonToExcel: async (req: any, res: any, next: NextFunction) => {
    try {

      if (req.file) {

        const inputExcelPath = req.file.path
        const outputFilePath = `src/public/uploads/json_${Date.now()}.xlsx`; // Output file

        try {
          // Check if input Excel file exists
          if (!fs.existsSync(inputExcelPath)) {
            console.error(`Error: Input Excel file '${inputExcelPath}' does not exist.`);
            process.exit(2);
          }

          // Read the Excel file
          const workbook = xlsx.readFile(inputExcelPath);

          // Get the first sheet name
          const sheetName = workbook.SheetNames[0];

          // Convert sheet data to JSON
          const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

          // Write JSON to output file
          fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2));
          console.log(`Excel successfully converted to JSON: ${outputFilePath}`);
          fs.unlink(inputExcelPath, (err) => {
            if (err) {
              console.error(`Error deleting file ${inputExcelPath}: ${err.message}`);
            } else {
              console.log(`Deleted file: ${inputExcelPath}`);
            }
          });
        } catch (error) {
          console.error(`An error occurred during conversion: ${error}`);
          // process.exit(2);
        }
      }

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  excelToJson: async (req: any, res: any, next: NextFunction) => {
    try {

      if (req.file) {

        const inputExcelPath = req.file.path
        const outputFilePath = `src/public/uploads/json_${Date.now()}.json`; // Output file

        try {
          // Check if input Excel file exists
          if (!fs.existsSync(inputExcelPath)) {
            console.error(`Error: Input Excel file '${inputExcelPath}' does not exist.`);
            process.exit(2);
          }

          // Read the Excel file
          const workbook = xlsx.readFile(inputExcelPath);

          // Get the first sheet name
          const sheetName = workbook.SheetNames[0];

          // Convert sheet data to JSON
          const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

          // Write JSON to output file
          fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2));
          console.log(`Excel successfully converted to JSON: ${outputFilePath}`);
          fs.unlink(inputExcelPath, (err) => {
            if (err) {
              console.error(`Error deleting file ${inputExcelPath}: ${err.message}`);
            } else {
              console.log(`Deleted file: ${inputExcelPath}`);
            }
          });
        } catch (error) {
          console.error(`An error occurred during conversion: ${error}`);
          // process.exit(2);
        }
      }

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },


}

export default documentService
