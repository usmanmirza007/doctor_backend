import { Request } from "express";
import multer from "multer";

export const stroage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void): void {
    cb(null, 'src/public/uploads')
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void): void {
    const cleanPath = file.originalname.replace(/\s+/g, '')

    cb(null, Date.now() + "-" + cleanPath)
  }
})