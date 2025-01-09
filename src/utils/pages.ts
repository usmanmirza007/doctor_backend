import fs from 'fs';
import path from 'path';
import libre from 'libreoffice-convert'
import { InternalServerError, SuccessResponse } from './customError';
import { Response } from 'express';
import { convertExcel } from './file';

export const pagesConvert = (inputPagePath: string, outputFilePath: string, extention: string, res: Response) => {

  try {
    const ext = extention === '.text' ? '.txt' : extention
    const inputPath = path.resolve(inputPagePath);
    const outputPath = path.resolve(outputFilePath);
    const file = fs.readFileSync(inputPath);

    libre.convert(file, ext, undefined, (err: NodeJS.ErrnoException | null, data: Buffer): void => {
      if (err) {
        console.error(`Error converting file: ${err}`);
        throw new InternalServerError(`Failed to encrypt PDF: ${err}`);
      }
      fs.writeFileSync(outputPath, data);
      if (extention == '.pdf') {
        convertExcel(outputFilePath)
      }
      const success = new SuccessResponse(`Pages to ${extention} convert has been successfully`);
      res.status(success.status).json({
        data: {
          status: success.status,
          message: success.message,
        }
      });
      console.log('File successfully converted pages:', outputPath);
    });

  } catch (error) {
    throw error
  }
}