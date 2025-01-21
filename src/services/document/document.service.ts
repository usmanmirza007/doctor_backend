
import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import xlsx from 'xlsx'
import path from 'path';
import sharp from 'sharp'
import csv from 'csvtojson'
import ExcelJS from 'exceljs'
import mammoth from 'mammoth'
import pdfParse from 'pdf-parse'
import PDFDocument from 'pdfkit'
import { Parser } from 'json2csv'
import PDFMerger from 'pdf-merger-js'
import shell, { ShellString } from 'shelljs'
import { Document, Packer, Paragraph } from 'docx'
import { ExecException } from 'child_process';
const docxConverter = require('docx-pdf');
let { exec } = require('child_process')
const PptxGenJs = require('pptxgenjs');

import {
  BadRequestError, correctSpelling, existsFileSync,
  extractTextFromDocx, fileDelete, InternalServerError,
  pagesConvert, SuccessResponse
} from '../../utils';
import { MulterRequest } from './dto';
import { convertExcel } from '../../utils/file';

const documentService = {

  encryptPDF: async (request: Request, res: Response, next: NextFunction) => {
    try {
      const req = request as MulterRequest;
      const { password } = req.body
      const inputfile = req.file.path

      if (!inputfile || !password) {
        throw new BadRequestError('Incomplet Parameter');
      }

      let outputfile = `src/public/uploads/encrpt_${Date.now()}.pdf`;

      if (!existsFileSync(inputfile)) {
        throw new BadRequestError('Some uploaded files do not exist. Please try again.');
      }

      exec(`python src/services/document/python/encryptPdf.py ${inputfile} ${outputfile} ${password}`, (error: ExecException | null, stdout: string, stderr: string) => {
        if (error || stderr) {
          const errorMessage = error?.message || stderr;
          throw new InternalServerError(`Failed to encrypt PDF: ${errorMessage}`);
        }
        console.log(`Python script output: ${stdout}`);
        fileDelete(inputfile)
        const success = new SuccessResponse('PDF has been encrpted successfully');
        return res.status(success.status).json({
          data: {
            status: success.status,
            message: success.message,
          }
        });
      });


    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  decryptPDF: async (request: Request, res: Response, next: NextFunction) => {
    try {
      const req = request as MulterRequest;
      const { password } = req.body
      const inputfile = req.file.path

      if (!inputfile || !password) {
        throw new BadRequestError('Incomplet Parameter');
      }
      let outputfile = `src/public/uploads/decrpt_${Date.now()}.pdf`;

      if (!existsFileSync(inputfile)) {
        throw new BadRequestError('Some uploaded files do not exist. Please try again.');
      }

      exec(`python src/services/document/python/decryptPdf.py ${inputfile} ${outputfile} ${password}`, (error: ExecException | null, stdout: string, stderr: string) => {
        if (error || stderr) {
          const errorMessage = error?.message || stderr;
          throw new InternalServerError(`Failed to encrypt PDF: ${errorMessage}`);
        }
        console.log(`Python script output: ${stdout}`);
        fileDelete(inputfile)
        const success = new SuccessResponse('PDF has been decrpted successfully');
        return res.status(success.status).json({
          data: {
            status: success.status,
            message: success.message,
          }
        });
      });

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  imageToPDF: async (request: Request, res: Response, next: NextFunction) => {
    try {
      const { files } = request as MulterRequest;

      if (!files) {
        throw new BadRequestError('Incomplet Parameter');
      }

      const filePathsArg = files.map((item: any) => item.path)
      const inputFilePath = filePathsArg.join(' ');
      const outputFilePath = `src/public/uploads/${Date.now()}.pdf`;

      if (!existsFileSync(filePathsArg)) {
        throw new BadRequestError('Some uploaded files do not exist. Please try again.');
      }

      exec(`python src/services/document/python/imageToPdf.py ${outputFilePath} ${inputFilePath}`, (error: ExecException | null, stdout: string, stderr: string) => {
        if (error || stderr) {
          const errorMessage = error?.message || stderr;
          throw new InternalServerError(`Failed to encrypt PDF: ${errorMessage}`);
        }

        console.log(`Python script output: ${stdout}`);
        fileDelete(filePathsArg)
        const success = new SuccessResponse('Image to pdf convert has been successfully');
        return res.status(success.status).json({
          data: {
            status: success.status,
            message: success.message,
          }
        });
      });


    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  pdfToWord: async (request: Request, res: Response, next: NextFunction) => {
    try {
      const req = request as MulterRequest;
      const inputfile = req.file.path

      if (!inputfile) {
        throw new BadRequestError('Incomplet Parameter');
      }

      // const filePathsArg = files.map((item: any) => item.path)
      // const inputFilePath = filePathsArg.join(' ');
      const outputFilePath = `src/public/uploads/${Date.now()}.docx`;

      if (!existsFileSync(inputfile)) {
        throw new BadRequestError('Uploaded file does not exist. Please try again.');
      }
      const pdfBuffer = fs.readFileSync(inputfile);
      const pdfData = await pdfParse(pdfBuffer);

      fileDelete(inputfile)
      const success = new SuccessResponse('PDF to word convert has been successfully');
      return res.status(success.status).json({
        data: {
          status: success.status,
          message: success.message,
        }
      });
    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  wordToPdf: async (request: Request, res: Response, next: NextFunction) => {
    try {
      const { file } = request as MulterRequest;

      if (!file) {
        throw new BadRequestError('Incomplet Parameter');
      }

      const inputWordPath = file.path
      const outputFilePath = `src/public/uploads/pdf_${Date.now()}.pdf`;

      if (!existsFileSync(inputWordPath)) {
        throw new BadRequestError('Uploaded file does not exist. Please try again.');
      }

      docxConverter(inputWordPath, outputFilePath, (err: any, result: any) => {
        if (err) {
          console.log('Error during conversion:', err);
          throw new InternalServerError(`Failed to convert image to pdf, details: ${err}`);
        } else {
          console.log('Word file successfully converted to PDF:', result);
          const success = new SuccessResponse('Word to pdf convert has been successfully');
          return res.status(success.status).json({
            data: {
              status: success.status,
              message: success.message,
            }
          });
        }
      });
      fileDelete(inputWordPath)

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  mergePdf: async (request: Request, res: Response, next: NextFunction) => {
    try {
      const { files } = request as MulterRequest;

      if (!files) {
        throw new BadRequestError('Incomplet Parameter');
      }

      const filePathsArg = files.map((item: any) => item.path)
      const outputFilePath = `src/public/uploads/merge_${Date.now()}.pdf`;

      if (!existsFileSync(filePathsArg)) {
        throw new BadRequestError('Uploaded file does not exist. Please try again.');
      }

      const merger = new PDFMerger();

      for (let file of filePathsArg) {
        await merger.add(file);
      }

      await merger.save(outputFilePath);
      fileDelete(filePathsArg)
      console.log('PDF files merged successfully into:', outputFilePath);
      const success = new SuccessResponse('PDF has been merged successfully');
      return res.status(success.status).json({
        data: {
          status: success.status,
          message: success.message,
        }
      });

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  csvToJson: async (request: Request, res: Response, next: NextFunction) => {
    try {
      const { file } = request as MulterRequest;

      if (!file) {
        throw new BadRequestError('Incomplet Parameter');
      }

      const inputCsvPath = file.path
      const outputFilePath = `src/public/uploads/json_${Date.now()}.json`;

      if (!existsFileSync(inputCsvPath)) {
        throw new BadRequestError('Uploaded file does not exist. Please try again.');
      }

      const jsonArray = await csv().fromFile(inputCsvPath);
      fs.writeFileSync(outputFilePath, JSON.stringify(jsonArray, null, 2));
      fileDelete(inputCsvPath)

      console.log(`CSV successfully converted to JSON: ${outputFilePath}`);
      const success = new SuccessResponse('CSV to json convert has been successfully');
      return res.status(success.status).json({
        data: {
          status: success.status,
          message: success.message,
        }
      });

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  jsonToCsv: async (request: Request, res: Response, next: NextFunction) => {
    try {
      const { file } = request as MulterRequest;

      if (!file) {
        throw new BadRequestError('Incomplet Parameter');
      }

      const inputJsonPath = file.path
      const outputFilePath = `src/public/uploads/csv_${Date.now()}.csv`;


      if (!existsFileSync(inputJsonPath)) {
        throw new BadRequestError('Uploaded file does not exist. Please try again.');
      }

      const jsonData = JSON.parse(fs.readFileSync(inputJsonPath, 'utf8'));
      const parser = new Parser();
      const csv = parser.parse(jsonData);

      fs.writeFileSync(outputFilePath, csv);
      console.log(`JSON successfully converted to CSV: ${outputFilePath}`);
      fileDelete(inputJsonPath)
      const success = new SuccessResponse('JSON to csv convert has been successfully');
      return res.status(success.status).json({
        data: {
          status: success.status,
          message: success.message,
        }
      });

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  excelToJson: async (request: Request, res: Response, next: NextFunction) => {
    try {
      const { file } = request as MulterRequest;

      if (!file) {
        throw new BadRequestError('Incomplet Parameter');
      }

      const inputExcelPath = file.path
      const outputFilePath = `src/public/uploads/json_${Date.now()}.json`;

      if (!existsFileSync(inputExcelPath)) {
        throw new BadRequestError('Uploaded file does not exist. Please try again.');
      }

      const workbook = xlsx.readFile(inputExcelPath);
      const sheetName = workbook.SheetNames[0];
      const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2));
      console.log(`Excel successfully converted to JSON: ${outputFilePath}`);
      fileDelete(inputExcelPath)
      const success = new SuccessResponse('Excel to json convert has been successfully');
      return res.status(success.status).json({
        data: {
          status: success.status,
          message: success.message,
        }
      });

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  jsonToExcel: async (request: Request, res: Response, next: NextFunction) => {
    try {
      const { file } = request as MulterRequest;

      if (!file) {
        throw new BadRequestError('Incomplet Parameter');
      }

      const inputExcelPath = file.path
      const outputFilePath = `src/public/uploads/json_${Date.now()}.xlsx`;

      if (!existsFileSync(inputExcelPath)) {
        throw new BadRequestError('Uploaded file does not exist. Please try again.');
      }

      const workbook = xlsx.readFile(inputExcelPath);
      const sheetName = workbook.SheetNames[0];
      const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      fs.writeFileSync(outputFilePath, JSON.stringify(jsonData, null, 2));
      console.log(`Excel successfully converted to JSON: ${outputFilePath}`);
      fileDelete(inputExcelPath)
      const success = new SuccessResponse('JSON to excel convert has been successfully');
      return res.status(success.status).json({
        data: {
          status: success.status,
          message: success.message,
        }
      });

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  wordToTxt: async (request: Request, res: Response, next: NextFunction) => {
    try {
      const { file } = request as MulterRequest;

      if (!file) {
        throw new BadRequestError('Incomplet Parameter');
      }

      const inputWordPath = file.path
      const outputFilePath = `src/public/uploads/txt_${Date.now()}.txt`;

      if (!existsFileSync(inputWordPath)) {
        throw new BadRequestError('Uploaded file does not exist. Please try again.');
      }

      const data = fs.readFileSync(inputWordPath);

      const result = await mammoth.extractRawText({ buffer: data });

      fs.writeFileSync(outputFilePath, result.value);
      console.log(`Word file successfully converted to Text: ${outputFilePath}`);
      fileDelete(inputWordPath)
      const success = new SuccessResponse('Word to text convert has been successfully');
      return res.status(success.status).json({
        data: {
          status: success.status,
          message: success.message,
        }
      });


    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  txtToWord: async (request: Request, res: Response, next: NextFunction) => {
    try {
      const { file } = request as MulterRequest;

      if (!file) {
        throw new BadRequestError('Incomplet Parameter');
      }

      const inputTxtPath = file.path
      const outputFilePath = `src/public/uploads/txt_${Date.now()}.docx`;

      if (!existsFileSync(inputTxtPath)) {
        throw new BadRequestError('Uploaded file does not exist. Please try again.');
      }

      const textContent = fs.readFileSync(inputTxtPath, 'utf8');
      const paragraphs = textContent.split('\n').map(line => new Paragraph(line));

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);
      fs.writeFileSync(outputFilePath, buffer);

      fileDelete(inputTxtPath)
      const success = new SuccessResponse('Text to word convert has been successfully');
      return res.status(success.status).json({
        data: {
          status: success.status,
          message: success.message,
        }
      });

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  compressPdf: async (request: Request, res: Response, next: NextFunction) => {
    try {
      // brew install ghostscript for pdf compress
      const { file } = request as MulterRequest;

      if (!file) {
        throw new BadRequestError('Incomplet Parameter');
      }

      const inputPdfPath = file.path
      const outputFilePath = `src/public/uploads/compress_${Date.now()}.pdf`;

      if (!existsFileSync(inputPdfPath)) {
        throw new BadRequestError('Uploaded file does not exist. Please try again.');
      }

      const command = `
            gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen \
            -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputFilePath} ${inputPdfPath}
            `;

      const result: ShellString = shell.exec(command);

      if (result.code !== 0) {
        throw new InternalServerError(`Failed to compress pdf, details: ${result}`);
      }

      console.log(`PDF successfully compressed: ${outputFilePath}`);
      fileDelete(inputPdfPath)
      const success = new SuccessResponse('PDF has been compressed successfully');
      return res.status(success.status).json({
        data: {
          status: success.status,
          message: success.message,
        }
      });

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  excelToPdf: async (request: Request, res: Response, next: NextFunction) => {
    try {
      // brew install ghostscript for pdf compress
      const { file } = request as MulterRequest;

      if (!file) {
        throw new BadRequestError('Incomplet Parameter');
      }

      const inputExcelPath = file.path
      const outputFilePath = `src/public/uploads/pdf_${Date.now()}.pdf`;

      if (!existsFileSync(inputExcelPath)) {
        throw new BadRequestError('Uploaded file does not exist. Please try again.');
      }

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(inputExcelPath);
      const worksheet: any = workbook.getWorksheet(1);

      const doc = new PDFDocument();
      const stream = fs.createWriteStream(outputFilePath);
      doc.pipe(stream);

      doc.fontSize(16).text('Excel to PDF Conversion', { align: 'center' });
      doc.moveDown();

      worksheet.eachRow({ includeEmpty: true }, (row: any, rowNumber: any) => {
        const rowValues = row.values.slice(1);
        doc.fontSize(12).text(rowValues.join(' | '));
      });

      doc.end();
      stream.on('finish', () => {
        fileDelete(inputExcelPath)
        console.log(`Excel successfully converted to PDF: ${outputFilePath}`);
        const success = new SuccessResponse('Excel to pdf convert has been successfully');
        return res.status(success.status).json({
          data: {
            status: success.status,
            message: success.message,
          }
        });
      });
      stream.off('finish', () => {
        console.log('Stream finished and event listener removed');
      });

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  pdfToExcel: async (request: Request, res: Response, next: NextFunction) => {
    try {
      // brew install ghostscript for pdf compress
      const { file } = request as MulterRequest;

      if (!file) {
        throw new BadRequestError('Incomplet Parameter');
      }
      convertExcel(file.path)
      const success = new SuccessResponse('PDF to Excel convert has been successfully');
      return res.status(success.status).json({
        data: {
          status: success.status,
          message: success.message,
        }
      });
    } catch (error) {
      console.log('err fof', error);
      next(error)
    }
  },

  imageConvert: async (request: Request, res: Response, next: NextFunction) => {
    try {
      // brew install ghostscript for pdf compress
      const req = request as MulterRequest;

      const { imagetype } = req.body
      const inputImagePath = req.file.path

      if (!inputImagePath || !imagetype) {
        throw new BadRequestError('Incomplet Parameter');
      }

      const outputFilePath = `src/public/uploads/image_${Date.now()}.${imagetype}`;

      if (!existsFileSync(inputImagePath)) {
        throw new BadRequestError('Uploaded file does not exist. Please try again.');
      }

      await sharp(inputImagePath).toFormat('png').toFile(outputFilePath);
      console.log(`Image converted successfully: ${outputFilePath}`);
      fileDelete(inputImagePath)

      const success = new SuccessResponse('Image has been convert successfully');
      return res.status(success.status).json({
        data: {
          status: success.status,
          message: success.message,
        }
      });

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  spellchecker: async (request: Request, res: Response, next: NextFunction) => {
    try {
      // brew install ghostscript for pdf compress
      const { file } = request as MulterRequest;

      const inputText = 'This is a sampple text with errrs.';
      if (!file) {
        throw new BadRequestError('Incomplet Parameter');
      }

      const inputFilePath = file.path
      const outputFilePath = `src/public/uploads/corrected_${Date.now()}.docx`;

      if (!existsFileSync(inputFilePath)) {
        throw new BadRequestError('Uploaded file does not exist. Please try again.');
      }

      const fileBuffer = fs.readFileSync(inputFilePath);
      const text = extractTextFromDocx(fileBuffer);
      const correctedText = correctSpelling(text);

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [new Paragraph(correctedText)],
          },
        ],
      });

      const buffer = await Packer.toBuffer(doc);
      fs.writeFileSync(outputFilePath, buffer);
      res.download(outputFilePath);
      fileDelete(inputFilePath)
      const success = new SuccessResponse('Spell has been correct successfully');
      return res.status(success.status).json({
        data: {
          status: success.status,
          message: success.message,
        }
      });

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  pageConvert: async (request: Request, res: Response, next: NextFunction) => {
    try {
      // brew install --cask libreoffice
      const req = request as MulterRequest;
      const { imagetype } = req.body
      const inputPagePath = req.file.path

      if (!inputPagePath || !imagetype) {
        throw new BadRequestError('Incomplet Parameter');
      }

      const extention = imagetype
      const outputFilePath = `src/public/uploads/corrected_${Date.now()}${extention}`;

      if (!existsFileSync(inputPagePath)) {
        throw new BadRequestError('Uploaded file does not exist. Please try again.');
      }

      const data = pagesConvert(inputPagePath, outputFilePath, extention, res)

      fileDelete(inputPagePath)

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  pdfToTxt: async (request: Request, res: Response, next: NextFunction) => {
    try {
      const { file } = request as MulterRequest;

      if (!file) {
        throw new BadRequestError('Incomplet Parameter');
      }
      const extention = '.txt'
      const inputPdfPath = file.path
      const outputFilePath = `src/public/uploads/txt_${Date.now()}${extention}`;

      const inputPath = path.resolve(inputPdfPath);
      const outputPath = path.resolve(outputFilePath);
      const dataBuffer = fs.readFileSync(path.resolve(inputPath));

      if (!existsFileSync(inputPdfPath)) {
        throw new BadRequestError('Uploaded file does not exist. Please try again.');
      }

      const data = await pdfParse(dataBuffer);
      fs.writeFileSync(outputPath, data.text);

      console.log('PDF successfully converted to TXT:', outputPath);

      fileDelete(inputPdfPath)

      const success = new SuccessResponse(`PDF to text convert has been successfully`);
      return res.status(success.status).json({
        data: {
          status: success.status,
          message: success.message,
        }
      });

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  wordToHtml: async (request: Request, res: Response, next: NextFunction) => {
    try {
      const { file } = request as MulterRequest;

      if (!file) {
        throw new BadRequestError('Incomplet Parameter');
      }

      const extention = '.html'
      const inputWordPath = file.path
      const outputFilePath = `src/public/uploads/txt_${Date.now()}${extention}`;

      if (!existsFileSync(inputWordPath)) {
        throw new BadRequestError('Uploaded file does not exist. Please try again.');
      }

      const command = `soffice --headless --convert-to html "${inputWordPath}" --outdir "${path.dirname(outputFilePath)}"`;

      exec(command, (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.error('Conversion error:', error);
          return;
        }
        console.log('Conversion successful!', stdout);
        fileDelete(inputWordPath)
      });
      const success = new SuccessResponse(`Word to HTML convert has been successfully`);
      return res.status(success.status).json({
        data: {
          status: success.status,
          message: success.message,
        }
      });

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  pdfToHtml: async (request: Request, res: Response, next: NextFunction) => {
    try {
      const { file } = request as MulterRequest;
      if (!file) {
        throw new BadRequestError('Incomplet Parameter');
      }
      // brew install poppler

      const extention = '.html'
      const inputPagePath = file.path
      const outputFilePath = `src/public/uploads/txt_${Date.now()}${extention}`;

      const outputDir = path.dirname(outputFilePath);
      const baseName = path.basename(outputFilePath, '.html');

      if (!existsFileSync(inputPagePath)) {
        throw new BadRequestError('Uploaded file does not exist. Please try again.');
      }

      const inputPath = path.resolve(inputPagePath);
      const outputPath = path.resolve(outputFilePath);

      const command = `pdftohtml -c -s -noframes "${inputPagePath}" "${outputDir}/${baseName}"`;


      exec(command, (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.error('Conversion error:', error);
          return;
        }
        console.log('Conversion successful!', stdout);
        fileDelete(inputPagePath)
      });

      const success = new SuccessResponse(`PDF to HTML convert has been successfully`);
      return res.status(success.status).json({
        data: {
          status: success.status,
          message: success.message,
        }
      });



    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  pdfToPowerPoint: async (request: Request, res: Response, next: NextFunction) => {
    try {
      const { file } = request as MulterRequest;

      if (!file) {
        throw new BadRequestError('Incomplet Parameter');
      }

      const extention = '.pptx'
      const inputPagePath = file.path
      const outputFilePath = `src/public/uploads/power_${Date.now()}${extention}`;

      if (!existsFileSync(inputPagePath)) {
        throw new BadRequestError('Uploaded file does not exist. Please try again.');
      }
      // Read the PDF file
      const pdfBuffer = fs.readFileSync(inputPagePath);

      // Extract text from the PDF
      const pdfData = await pdfParse(pdfBuffer);
      // const pdfDoc = await PDFDocuments.load(pdfBuffer);

      // console.log('fofof',pdfData.numpages, pdfData.text);

      // Create a new PowerPoint presentation
      const ppt = new PptxGenJs();

      // Split the PDF text into pages

      // Create a slide for each page
      for (let i = 0; i < pdfData.numpages; i++) {
        // const page = pdfDoc.getPage(i);
        // console.log('page',page);

        const pages = pdfData.text.split('\f'); // '\f' represents page breaks in PDF text

        // Extract text from the page
        // const textContent = page.getTextContent ? await page.getTextContent() : ''; // Replace this with actual page content fetching logic
        // const pageText = textContent.items.map((item: any) => item.str).join(' '); // Join the extracted text

        // Create a new slide for the page
        // const slide = ppt.addSlide();
        pages.forEach((pageText, index) => {
          // Create a new slide
          const slide = ppt.addSlide();

          // Add the page text to the slide
          slide.addText(pageText.trim(), {
            x: 0.5, // X position
            y: 0.5, // Y position
            w: '90%', // Width of the text box
            h: '80%', // Height of the text box
            fontSize: 18, // Font size
            color: '000000', // Black text
            align: 'left', // Align text to the left
          });

          // Add a footer with the page number
          slide.addText(`Page ${index + 1}`, {
            x: 7, // X position
            y: 6.5, // Y position
            fontSize: 10, // Font size
            color: '666666', // Gray text
            align: 'right', // Align text to the right
          });
        });
      }

      // Save the PowerPoint presentation
      await ppt.writeFile({ fileName: outputFilePath });
      fileDelete(inputPagePath)
      console.log(`Converted PDF to PowerPoint: ${outputFilePath}`);

      const success = new SuccessResponse(`PDF to HTML convert has been successfully`);
      return res.status(success.status).json({
        data: {
          status: success.status,
          message: success.message,
        }
      });

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

}

export default documentService
