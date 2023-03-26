import * as multer from 'multer';
import { storageOptions } from './helpers/disk-storage.options';

export const getStorage = () => {
  switch (process.env.NODE_ENV) {
    case 'test':
      return multer.memoryStorage();
    default:
      return multer.diskStorage(storageOptions);
  }
};
