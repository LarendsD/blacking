import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  uploadFile(file: Express.Multer.File) {
    return { path: file.path };
  }

  uploadImage(image: Express.Multer.File) {
    return { path: image.path };
  }

  uploadVideo(video: Express.Multer.File) {
    return { path: video.path };
  }

  uploadMusic(music: Express.Multer.File) {
    return { path: music.path };
  }

  deleteFile(path: string) {
    return fs.rmSync(path);
  }
}
