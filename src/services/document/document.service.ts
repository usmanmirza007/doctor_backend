
import { NextFunction } from 'express';

let { exec } = require('child_process')
import PDFMerger from 'pdf-merger-js'
import fs from 'fs';
import path from 'path';
import csv from 'csvtojson'
import { Parser } from 'json2csv'
import xlsx from 'xlsx'
import mammoth from 'mammoth'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import shell from 'shelljs'
import ExcelJS from 'exceljs'
import PDFDocument from 'pdfkit'
import pdfParse from 'pdf-parse'
import sharp from 'sharp'
const docxConverter = require('docx-pdf');
const DocxMerger = require('docx-merger');


import { correctSpelling, extractTextFromDocx, pagesConvert } from '../../utils';

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

  wordToPdf: async (req: any, res: any, next: NextFunction) => {
    try {

      console.log('sdfsdfosdf', req.file);
      if (req.file) {

        const inputWordPath = req.file.path
        const outputFilePath = `src/public/uploads/pdf_${Date.now()}.pdf`; // Output file

        docxConverter(inputWordPath, outputFilePath, (err: any, result: any) => {
          if (err) {
            console.log('Error during conversion:', err);
          } else {
            console.log('Word file successfully converted to PDF:', result);
          }
        });
        //   // Delete the uploaded image files after PDF generation
        fs.unlink(inputWordPath, (err) => {
          if (err) {
            console.error(`Error deleting file ${inputWordPath}: ${err.message}`);
          } else {
            console.log(`Deleted file: ${inputWordPath}`);
          }
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
        }
      }

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  wordToTxt: async (req: any, res: any, next: NextFunction) => {
    try {

      if (req.file) {

        const inputWordPath = req.file.path
        const outputFilePath = `src/public/uploads/txt_${Date.now()}.txt`; // Output file

        try {
          // Check if input Word file exists
          if (!fs.existsSync(inputWordPath)) {
            console.error(`Error: Input Word file '${inputWordPath}' does not exist.`);
            process.exit(2);
          }

          // Read the Word file
          const data = fs.readFileSync(inputWordPath);

          // Extract text from the Word file
          const result = await mammoth.extractRawText({ buffer: data });

          // Write extracted text to output file
          fs.writeFileSync(outputFilePath, result.value);
          console.log(`Word file successfully converted to Text: ${outputFilePath}`);
          fs.unlink(inputWordPath, (err) => {
            if (err) {
              console.error(`Error deleting file ${inputWordPath}: ${err.message}`);
            } else {
              console.log(`Deleted file: ${inputWordPath}`);
            }
          });
        } catch (error) {
          console.error(`An error occurred during conversion: ${error}`);
        }
      }

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  txtToWord: async (req: any, res: any, next: NextFunction) => {
    try {

      if (req.file) {

        const inputTxtPath = req.file.path
        const outputFilePath = `src/public/uploads/txt_${Date.now()}.docx`; // Output file

        try {
          // Check if input text file exists
          if (!fs.existsSync(inputTxtPath)) {
            console.error(`Error: Input text file '${inputTxtPath}' does not exist.`);
            process.exit(2);
          }

          // Read the text file
          const textContent = fs.readFileSync(inputTxtPath, 'utf8');

          // Split text into lines and create paragraphs
          const paragraphs = textContent.split('\n').map(line => new Paragraph(line));

          // Create a Word document
          const doc = new Document({
            sections: [
              {
                properties: {},
                children: paragraphs,
              },
            ],
          });

          // Generate and save the Word file
          const buffer = await Packer.toBuffer(doc);
          fs.writeFileSync(outputFilePath, buffer);

          fs.unlink(inputTxtPath, (err) => {
            if (err) {
              console.error(`Error deleting file ${inputTxtPath}: ${err.message}`);
            } else {
              console.log(`Deleted file: ${inputTxtPath}`);
            }
          });
        } catch (error) {
          console.error(`An error occurred during conversion: ${error}`);
        }
      }

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  compressPdf: async (req: any, res: any, next: NextFunction) => {
    try {
      // brew install ghostscript for pdf compress

      if (req.file) {

        const inputPdfPath = req.file.path
        const outputFilePath = `src/public/uploads/compress_${Date.now()}.pdf`; // Output file

        try {
          // Check if input PDF file exists
          if (!fs.existsSync(inputPdfPath)) {
            console.error(`Error: Input PDF file '${inputPdfPath}' does not exist.`);
            process.exit(2);
          }

          // Ghostscript command for compression
          const command = `
            gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen \
            -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputFilePath} ${inputPdfPath}
            `;

          // Execute the command
          const result = shell.exec(command);

          if (result.code !== 0) {
            console.error('Error during compression:', result.stderr);
            process.exit(2);
          }

          console.log(`PDF successfully compressed: ${outputFilePath}`);
          fs.unlink(inputPdfPath, (err) => {
            if (err) {
              console.error(`Error deleting file ${inputPdfPath}: ${err.message}`);
            } else {
              console.log(`Deleted file: ${inputPdfPath}`);
            }
          });
        } catch (error) {
          console.error(`An error occurred during conversion: ${error}`);
        }
      }

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  excelToPdf: async (req: any, res: any, next: NextFunction) => {
    try {
      // brew install ghostscript for pdf compress

      if (req.file) {

        const inputExcelPath = req.file.path
        const outputFilePath = `src/public/uploads/pdf_${Date.now()}.pdf`; // Output file

        try {
          // Check if input Excel file exists
          if (!fs.existsSync(inputExcelPath)) {
            console.error(`Error: Input Excel file '${inputExcelPath}' does not exist.`);
            process.exit(2);
          }

          // Read Excel file
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.readFile(inputExcelPath);
          const worksheet: any = workbook.getWorksheet(1); // Read the first worksheet

          // Create PDF document
          const doc = new PDFDocument();
          const stream = fs.createWriteStream(outputFilePath);
          doc.pipe(stream);

          // Set title
          doc.fontSize(16).text('Excel to PDF Conversion', { align: 'center' });
          doc.moveDown();

          // Extract rows and write to PDF
          worksheet.eachRow({ includeEmpty: true }, (row: any, rowNumber: any) => {
            const rowValues = row.values.slice(1); // Remove empty first value
            doc.fontSize(12).text(rowValues.join(' | ')); // Format as table
          });

          // Finalize and save PDF
          doc.end();
          stream.on('finish', () => {
            console.log(`Excel successfully converted to PDF: ${outputFilePath}`);
          });
          fs.unlink(inputExcelPath, (err) => {
            if (err) {
              console.error(`Error deleting file ${inputExcelPath}: ${err.message}`);
            } else {
              console.log(`Deleted file: ${inputExcelPath}`);
            }
          });
        } catch (error) {
          console.error(`An error occurred during conversion: ${error}`);
        }
      }

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  pdfToExcel: async (req: any, res: any, next: NextFunction) => {
    try {
      // brew install ghostscript for pdf compress

      if (req.file) {

        const inputPdfPath = req.file.path
        const outputFilePath = `src/public/uploads/excel_${Date.now()}.xlsx`; // Output file

        try {
          // Check if input file exists
          if (!fs.existsSync(inputPdfPath)) {
            console.error(`Error: Input PDF file '${inputPdfPath}' does not exist.`);
            process.exit(2);
          }

          // Read PDF file
          const dataBuffer = fs.readFileSync(inputPdfPath);
          const data = await pdfParse(dataBuffer);

          // Extract text from PDF
          const text = data.text;

          // Split text into rows and columns
          const rows = text.split('\n').map(row => row.split(/\s{2,}/)); // Split by spaces or tabs

          // Create Excel workbook and worksheet
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Sheet1');

          // Add rows to worksheet
          rows.forEach(row => {
            worksheet.addRow(row);
          });

          // Write to Excel file
          await workbook.xlsx.writeFile(outputFilePath);
          console.log(`PDF successfully converted to Excel: ${outputFilePath}`);
          fs.unlink(inputPdfPath, (err) => {
            if (err) {
              console.error(`Error deleting file ${inputPdfPath}: ${err.message}`);
            } else {
              console.log(`Deleted file: ${inputPdfPath}`);
            }
          });
        } catch (error) {
          console.error(`An error occurred during conversion: ${error}`);
        }
      }

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  imageConvert: async (req: any, res: any, next: NextFunction) => {
    try {
      // brew install ghostscript for pdf compress
      const { imagetype } = req.body

      if (req.file) {

        const inputImagePath = req.file.path
        const outputFilePath = `src/public/uploads/image_${Date.now()}.${imagetype}`; // Output file

        try {
          await sharp(inputImagePath)
            .toFormat('png') // Change to desired format (e.g., 'jpeg', 'webp', 'tiff', 'gif')
            .toFile(outputFilePath);
          console.log(`Image converted successfully: ${outputFilePath}`);
          fs.unlink(inputImagePath, (err) => {
            if (err) {
              console.error(`Error deleting file ${inputImagePath}: ${err.message}`);
            } else {
              console.log(`Deleted file: ${inputImagePath}`);
            }
          });
        } catch (error) {
          console.error(`An error occurred during conversion: ${error}`);
        }
      }

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  spellchecker: async (req: any, res: any, next: NextFunction) => {
    try {
      // brew install ghostscript for pdf compress
      const inputText = 'This is a sampple text with errrs.';
      if (req.file) {

        const inputFilePath = req.file.path
        const outputFilePath = `src/public/uploads/corrected_${Date.now()}.docx`; // Output file

        try {
          if (!req.file) {
            return res.status(400).send('No file uploaded.');
          }

          // Read Word file content
          const fileBuffer = fs.readFileSync(inputFilePath);
          const text = extractTextFromDocx(fileBuffer); // Extract text from the Word file

          // Perform spell check and correction
          const correctedText = correctSpelling(text);

          // Create a new Word document with corrected text
          const doc = new Document({
            sections: [
              {
                properties: {},
                children: [new Paragraph(correctedText)], // Add corrected text
              },
            ],
          });
          // const doc = new Document();
          // const paragraph = new Paragraph(new TextRun(correctedText)); // Proper formatting
          // doc.addSection({ children: [paragraph] });


          // Save the corrected Word document
          const buffer = await Packer.toBuffer(doc);
          fs.writeFileSync(outputFilePath, buffer);
          res.download(outputFilePath);
          fs.unlink(inputFilePath, (err) => {
            if (err) {
              console.error(`Error deleting file ${inputFilePath}: ${err.message}`);
            } else {
              console.log(`Deleted file: ${inputFilePath}`);
            }
          });
        } catch (error) {
          console.error(`An error occurred during conversion: ${error}`);
        }
      }

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  pageConvert: async (req: any, res: any, next: NextFunction) => {
    try {
      // brew install --cask libreoffice
      if (req.file) {
        const { imagetype } = req.body

        const extention = imagetype
        const inputPagePath = req.file.path
        const outputFilePath = `src/public/uploads/corrected_${Date.now()}${extention}`;

        try {
          if (!req.file) {
            return res.status(400).send('No file uploaded.');
          }

          pagesConvert(inputPagePath, outputFilePath, extention)


          fs.unlink(inputPagePath, (err) => {
            if (err) {
              console.error(`Error deleting file ${inputPagePath}: ${err.message}`);
            } else {
              console.log(`Deleted file: ${inputPagePath}`);
            }
          });
        } catch (error) {
          console.error(`An error occurred during conversion: ${error}`);
        }
      }

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  mergeWord: async (req: any, res: any, next: NextFunction) => {
    try {
      // brew install --cask libreoffice
      console.log('yoyoyoy');

      if (req.files) {
        console.log('fofofofo');


        const extention = '.docx'
        const inputPagePath = req.files
        const outputFilePath = `src/public/uploads/merge_docs_${Date.now()}${extention}`;
        // console.log(';inputPagePath[0].path', inputPagePath[0].path);

        try {

          // if (!req.files) {
          //   return res.status(400).send('No file uploaded.');
          // }
          // return
          // const file1 = fs.readFileSync(path.resolve(__dirname, 'src/public/uploads/test.docx'), { encoding: 'binary' });
          // const file2 = fs.readFileSync(path.resolve(__dirname, 'src/public/uploads/test1.docx'), { encoding: 'binary' });
            // console.log('file1', file1);
            
          // Merge DOCX files
          const docx = new DocxMerger({}, ['src/public/uploads/test.docx', 'src/public/uploads/test1.docx']);

          const inputPath = path.resolve(inputPagePath);
          const outputPath = path.resolve(outputFilePath);
          // var docx = new DocxMerger({}, [inputPath, outputPath]);


          //SAVING THE DOCX FILE

          docx.save('nodebuffer', function (data: any) {
            // fs.writeFile("output.zip", data, function(err){/*...*/});
            fs.writeFile("output.docx", data, function (err) {
              
            });
            console.log('success');
          });


  pdfToTxt: async (req: any, res: any, next: NextFunction) => {
    try {

      if (req.file) {

        const extention = '.txt'
        const inputPagePath = req.file.path
        const outputFilePath = `src/public/uploads/txt_${Date.now()}${extention}`;
        console.log('inputPagePath', inputPagePath);

        try {

          const inputPath = path.resolve(inputPagePath);
          const outputPath = path.resolve(outputFilePath);
          const dataBuffer = fs.readFileSync(path.resolve(inputPath));

          const data = await pdfParse(dataBuffer);

          fs.writeFileSync(outputPath, data.text);

          console.log('PDF successfully converted to TXT:', outputPath);

          fs.unlink(inputPagePath, (err) => {
            if (err) {
              console.error(`Error deleting file ${inputPagePath}: ${err.message}`);
            } else {
              console.log(`Deleted file: ${inputPagePath}`);
            }
          })
        } catch (error) {
          console.error(`An error occurred during conversion: ${error}`);
        }
      }

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },

  wordToHtml: async (req: any, res: any, next: NextFunction) => {
    try {

      if (req.file) {

        const extention = '.html'
        const inputPagePath = req.file.path
        const outputFilePath = `src/public/uploads/txt_${Date.now()}${extention}`;
        console.log('inputPagePath', inputPagePath);

        try {

          fs.readFile(inputPagePath, (err, data) => {
            if (err) {
              return console.log('Error reading file:', err);
            }

            // Convert DOCX to HTML
            mammoth.convertToHtml({ buffer: data })
              .then(result => {
                console.log(result.value); // HTML content
                fs.writeFileSync(outputFilePath, result.value);
                console.log('Conversion successful!');
              })
              .catch(err => console.log('Conversion error:', err));
          });

          fs.unlink(inputPagePath, (err) => {
            if (err) {
              console.error(`Error deleting file ${inputPagePath}: ${err.message}`);
            } else {
              console.log(`Deleted file: ${inputPagePath}`);
            }
          })
        } catch (error) {
          console.error(`An error occurred during conversion: ${error}`);
        }
      }

    } catch (error) {
      console.log('err', error);
      next(error)
    }
  },


}

export default documentService
