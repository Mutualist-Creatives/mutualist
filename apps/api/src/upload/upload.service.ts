import { Injectable, BadRequestException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'SUPABASE_URL and SUPABASE_SERVICE_KEY must be defined in environment variables',
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async uploadFile(file: Express.Multer.File, bucket: string) {
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${timestamp}-${randomString}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await this.supabase.storage
        .from(bucket)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        throw new BadRequestException(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = this.supabase.storage.from(bucket).getPublicUrl(data.path);

      return {
        fileName: data.path,
        publicUrl,
        bucket,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      // Extract bucket and file path from URL
      // URL format: https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
      const urlParts = fileUrl.split('/storage/v1/object/public/');
      if (urlParts.length !== 2) {
        console.warn('Invalid Supabase URL format:', fileUrl);
        throw new BadRequestException(
          `Invalid Supabase URL format: ${fileUrl}`,
        );
      }

      const [bucket, ...pathParts] = urlParts[1].split('/');
      const filePath = pathParts.join('/');

      if (!bucket || !filePath) {
        console.warn('Could not extract bucket or path from URL:', fileUrl);
        throw new BadRequestException(
          `Could not extract bucket or path from URL: ${fileUrl}`,
        );
      }

      console.log(`Deleting file from bucket: ${bucket}, path: ${filePath}`);

      // Delete from Supabase Storage
      const { error } = await this.supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        console.error('Supabase delete error:', error);
        throw new BadRequestException(
          `Failed to delete file from storage: ${error.message}`,
        );
      }

      console.log(`Successfully deleted file: ${filePath}`);
      return true;
    } catch (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  }

  async deleteMultipleFiles(fileUrls: string[]): Promise<void> {
    if (!fileUrls || fileUrls.length === 0) {
      console.log('No files to delete');
      return;
    }

    console.log(`Deleting ${fileUrls.length} files from storage`);
    const deletePromises = fileUrls.map((url) => this.deleteFile(url));
    await Promise.all(deletePromises);
    console.log('All files deleted successfully');
  }
}
