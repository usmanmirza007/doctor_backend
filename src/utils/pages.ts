import fs from 'fs';
import path from 'path';
import libre from 'libreoffice-convert'
 
export const pagesConvert = (inputPagePath: string, outputFilePath: string, extention: string) => {

  const ext = extention;
  const inputPath = path.resolve(inputPagePath);
  const outputPath = path.resolve(outputFilePath);
  const file = fs.readFileSync(inputPath);

  libre.convert(file, ext, undefined, (err, done) => {
    if (err) {
      console.error(`Error converting file: ${err}`);
      return;
    }
    fs.writeFileSync(outputPath, done);
    console.log('File successfully converted pages:', outputPath);
  });
}