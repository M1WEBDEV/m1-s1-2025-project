import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './resources/images',
        filename: (_req, file, cb) => {
          const name = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
          const fileExt = extname(file.originalname);
          cb(null, `${name}${fileExt}`);
        },
      }),
    }),
  )
  upload(@UploadedFile() file: any) {
    if (!file || !file.filename) return { url: null };
    return { url: `/resources/images/${file.filename}` };
  }
}
