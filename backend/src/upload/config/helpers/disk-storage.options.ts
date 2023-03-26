import * as fs from 'fs';
import multer from 'multer';
import { extname, sep } from 'path';
import { cipher } from '../../../common/secure/cipher';

export const storageOptions: multer.DiskStorageOptions = {
  destination: function (req, file, cb) {
    const unuquePath = cipher(`${Date.now()}`)
      .split('')
      .map((symbol, index) => {
        if (index % 3 === 0 && index !== 0) {
          return `${symbol}${sep}`;
        }
        return symbol;
      })
      .join('');

    const pathToFile = `.${sep}upload${sep}${file.fieldname}${sep}${unuquePath}`;

    fs.mkdirSync(pathToFile, {
      recursive: true,
    });

    cb(null, pathToFile);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Math.round(Math.random() * 1e9);

    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
  },
};
