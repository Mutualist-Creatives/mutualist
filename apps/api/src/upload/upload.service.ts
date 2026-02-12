import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly uploadDir: string;
  private readonly apiBaseUrl: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR', './uploads');
    this.apiBaseUrl = this.configService.get<string>(
      'API_BASE_URL',
      'http://localhost:8080',
    );

    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      try {
        fs.mkdirSync(this.uploadDir, { recursive: true });
        this.logger.log(`Created upload directory: ${this.uploadDir}`);
      } catch (error) {
        this.logger.error(
          `Failed to create upload directory: ${this.uploadDir}`,
          error,
        );
      }
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    bucket: string,
    folder?: string,
    customName?: string,
  ) {
    try {
      const fileExt = file.originalname.split('.').pop();
      let baseFileName: string;

      if (customName) {
        // Sanitize custom name
        const sanitized = customName.replace(/[^a-zA-Z0-9-_\.]/g, '-');
        if (sanitized.endsWith(`.${fileExt}`)) {
          baseFileName = sanitized;
        } else {
          baseFileName = `${sanitized}.${fileExt}`;
        }
      } else {
        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        baseFileName = `${timestamp}-${randomString}.${fileExt}`;
      }

      // Treat "bucket" as a top-level folder in the uploads directory
      const bucketPath = path.join(this.uploadDir, bucket);
      const targetFolder = folder ? path.join(bucketPath, folder) : bucketPath;

      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
      }

      const filePath = path.join(targetFolder, baseFileName);

      // Write file to disk
      fs.writeFileSync(filePath, file.buffer);
      this.logger.log(`File saved to: ${filePath}`);

      // Construct public URL
      // URL format: {API_BASE_URL}/uploads/{bucket}/{folder}/{filename}
      const relativePath = folder
        ? `${bucket}/${folder}/${baseFileName}`
        : `${bucket}/${baseFileName}`;

      // Ensure no double slashes if base url has one
      const baseUrl = this.apiBaseUrl.replace(/\/$/, '');
      const publicUrl = `${baseUrl}/uploads/${relativePath}`;

      return {
        fileName: relativePath, // Keeping 'fileName' key for compatibility, though it usually meant path
        publicUrl,
        bucket,
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Upload failed: ${err.message}`, err.stack);
      throw new BadRequestException(`Failed to upload file: ${err.message}`);
    }
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      // fileUrl example: http://localhost:8080/uploads/bucket/folder/file.jpg
      // We need to extract 'bucket/folder/file.jpg'

      const urlObj = new URL(fileUrl);
      const pathName = urlObj.pathname; // /uploads/bucket/folder/file.jpg

      // Remove /uploads/ prefix
      const relativePath = pathName.replace(/^\/uploads\//, '');

      // Prevent directory traversal attacks
      if (relativePath.includes('..')) {
        this.logger.warn(`Invalid file path attempted: ${relativePath}`);
        return false;
      }

      const filePath = path.join(this.uploadDir, relativePath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(`Deleted file: ${filePath}`);
        return true;
      } else {
        this.logger.warn(`File not found for deletion: ${filePath}`);
        return false;
      }
    } catch (error) {
      this.logger.error(`Failed to delete file: ${fileUrl}`, error);
      return false;
    }
  }

  async deleteMultipleFiles(fileUrls: string[]): Promise<void> {
    if (!fileUrls || fileUrls.length === 0) {
      return;
    }

    this.logger.log(`Attempting to delete ${fileUrls.length} files`);

    const results = await Promise.allSettled(
      fileUrls.map((url) => this.deleteFile(url)),
    );

    const successful = results.filter(
      (r) => r.status === 'fulfilled' && r.value === true,
    ).length;
    this.logger.log(
      `File deletion complete: ${successful} successful out of ${fileUrls.length}`,
    );
  }
}
