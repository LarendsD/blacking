import {
  Controller,
  Delete,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator() позже определить лимит!
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.uploadService.uploadFile(file);
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator() позже определить лимит!
          new FileTypeValidator({ fileType: /jpeg$|png$|bmp$/ }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    return this.uploadService.uploadImage(image);
  }

  @Post('video')
  @UseInterceptors(FileInterceptor('video'))
  uploadVideo(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator() позже определить лимит!
          new FileTypeValidator({ fileType: /mp4$|x-msvideo$|webm$/ }),
        ],
      }),
    )
    video: Express.Multer.File,
  ) {
    return this.uploadService.uploadVideo(video);
  }

  @Post('music')
  @UseInterceptors(FileInterceptor('music'))
  uploadMusic(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator() позже определить лимит!
          new FileTypeValidator({ fileType: /mpeg$|wav$/ }),
        ],
      }),
    )
    music: Express.Multer.File,
  ) {
    return this.uploadService.uploadMusic(music);
  }

  @Delete()
  deleteFile(@Query('path') path: string) {
    return this.uploadService.deleteFile(path);
  }
}
