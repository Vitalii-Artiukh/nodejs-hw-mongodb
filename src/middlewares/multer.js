import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';
import createHttpError from 'http-errors';

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '/tmp/my-uploads');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + '-' + uniqueSuffix);
//   },
// });

const storage = multer.diskStorage({
  destination: TEMP_UPLOAD_DIR,
  filename: (req, file, cb) => {
    const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePrefix}_${file.originalname}`;
    cb(null, filename);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 10,
};

const fileFilter = (req, file, cb) => {
  // перевірка на тип файлу
  const extention = file.originalname.split('.').pop();
  // тип файлу .exe заборонений
  if (extention === 'exe') {
    return cb(createHttpError(400, "File type 'exe' is not allowed"));
  }
  // якщо все ок
  cb(null, true);
};

export const uploads = multer({
  storage,
  limits,
  fileFilter,
});
