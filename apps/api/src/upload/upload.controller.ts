import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Body,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 })],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Body('bucket') bucket?: string,
    @Body('folder') folder?: string,
    @Body('filename') filename?: string,
  ) {
    // Manual validation for better control and error messages
    if (!file.mimetype.startsWith('image/') && file.mimetype !== 'video/mp4') {
      throw new BadRequestException(
        `Validation failed (current file type is ${file.mimetype}, expected type is image/* or video/mp4)`,
      );
    }

    // Pipe handles validation logic
    const bucketName = bucket || 'portfolio-images';
    const result = await this.uploadService.uploadFile(
      file,
      bucketName,
      folder,
      filename,
    );

    return result;
  }
}
