import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { getStorage } from './config/get-storage.config';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    MulterModule.register({
      storage: getStorage(),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
