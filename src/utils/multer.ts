import multer from "multer";

export const stroage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/uploads')
  },
  filename: function (req, file, cb) {
    const cleanPath = file.originalname.replace(/\s+/g, '')

    cb(null, Date.now() + "-" + cleanPath)
  }
})