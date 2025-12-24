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

    this.supabase = createClient(supabaseUrl, supabaseKey) as SupabaseClient;
  }

  async uploadFile(file: Express.Multer.File, bucket: string, folder?: string) {
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const fileExt = file.originalname.split('.').pop();
      const baseFileName = `${timestamp}-${randomString}.${fileExt}`;

      // Add folder prefix if provided
      const fileName = folder ? `${folder}/${baseFileName}` : baseFileName;

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
      const err = error as Error;
      throw new BadRequestException(`Failed to upload file: ${err.message}`);
    }
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      // Extract bucket and file path from URL
      // URL format: https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
      const urlParts = fileUrl.split('/storage/v1/object/public/');
      if (urlParts.length !== 2) {
        console.warn('Invalid Supabase URL format, skipping:', fileUrl);
        // Don't throw error, just skip this file
        return false;
      }

      const [bucket, ...pathParts] = urlParts[1].split('/');
      const filePath = pathParts.join('/');

      if (!bucket || !filePath) {
        console.warn(
          'Could not extract bucket or path from URL, skipping:',
          fileUrl,
        );
        // Don't throw error, just skip this file
        return false;
      }

      console.log(`Deleting file from bucket: ${bucket}, path: ${filePath}`);

      // Delete from Supabase Storage
      const { error } = await this.supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        console.error('Supabase delete error:', error);
        // Don't throw error, just log and continue
        console.warn(`Failed to delete file ${filePath}, continuing anyway`);
        return false;
      }

      console.log(`Successfully deleted file: ${filePath}`);
      return true;
    } catch (error) {
      console.error('Failed to delete file:', error);
      // Don't throw error, just log and continue
      console.warn(`Error deleting file ${fileUrl}, continuing anyway`);
      return false;
    }
  }

  async deleteMultipleFiles(fileUrls: string[]): Promise<void> {
    if (!fileUrls || fileUrls.length === 0) {
      console.log('No files to delete');
      return;
    }

    console.log(`Attempting to delete ${fileUrls.length} files from storage`);

    // Delete files but don't fail if some deletions fail
    const results = await Promise.allSettled(
      fileUrls.map((url) => this.deleteFile(url)),
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    console.log(
      `File deletion complete: ${successful} successful, ${failed} failed`,
    );

    // Don't throw error even if some deletions failed
    // Portfolio deletion should continue
  }
}
