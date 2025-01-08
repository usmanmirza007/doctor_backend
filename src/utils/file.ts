import fs from 'fs';

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