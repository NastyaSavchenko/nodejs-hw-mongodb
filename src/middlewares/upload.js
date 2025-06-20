import multer from 'multer';
import path from 'node:path';

const storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, path.resolve('src', 'temp'));
  },
  filename: function (req, file, cd) {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cd(null, uniquePrefix + '-' + file.originalname);
  },
});

export const upload = multer({ storage });
