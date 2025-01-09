import fs from 'fs';
import PdfParse from 'pdf-parse';
import { BadRequestError } from './customError';
import ExcelJS from 'exceljs'


const unlinkFile = (inputfile: string) => {
  fs.unlink(inputfile, (err: NodeJS.ErrnoException | null) => {
    if (err) {
      console.error(`Error deleting file ${inputfile}: ${err.message}`);
    } else {
      console.log(`Deleted file: ${inputfile}`);
    }
  });
}

export const fileDelete = (inputfile: Array<string> | string): void => {

  if (Array.isArray(inputfile) && inputfile?.length) {
    inputfile.forEach((filePath: string) => {
      unlinkFile(filePath)
    })
  } else {
    if (typeof inputfile === 'string') {
      unlinkFile(inputfile)
    }
  }
}

export const existsFileSync = (inputfile: Array<string> | string): boolean => {

  if (Array.isArray(inputfile)) {
    return inputfile.every((filePath) => fs.existsSync(filePath));
  }

  if (typeof inputfile === 'string') {
    return fs.existsSync(inputfile);
  }

  return false;
}

export const convertExcel = async (inputPdfPath: string) => {

  try {
    const outputFilePath = `src/public/uploads/excel_${Date.now()}.xlsx`;

    if (!existsFileSync(inputPdfPath)) {
      throw new BadRequestError('Uploaded file does not exist. Please try again.');
    }

    const dataBuffer = fs.readFileSync(inputPdfPath);
    const data = await PdfParse(dataBuffer);

    const text = data.text;
    const rows = text.split('\n').map(row => row.split(/\s{2,}/));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');

    rows.forEach(row => {
      worksheet.addRow(row);
    });

    await workbook.xlsx.writeFile(outputFilePath);
    console.log(`PDF successfully converted to Excel: ${outputFilePath}`);
    fileDelete(inputPdfPath)
  } catch (error) {
    console.log('err', error);

  }
}