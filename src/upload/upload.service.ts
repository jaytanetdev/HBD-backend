import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadToCloudinary(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'birthday-cards',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Upload failed'));
          }
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async deleteFromCloudinary(url: string): Promise<void> {
    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/birthday-cards/filename.jpg
    // We need: birthday-cards/filename (without extension)
    
    try {
      const urlParts = url.split('/');
      const uploadIndex = urlParts.indexOf('upload');
      
      if (uploadIndex === -1) {
        throw new Error('Invalid Cloudinary URL');
      }
      
      // Get everything after 'upload' and version (v1234567890)
      const pathParts = urlParts.slice(uploadIndex + 2); // Skip 'upload' and version
      const fullPath = pathParts.join('/');
      
      // Remove file extension
      const publicId = fullPath.replace(/\.[^/.]+$/, '');
      
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      
      // Try again with 'image' resource type if 'raw' fails
      await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
      
      // Try with 'video' resource type for audio/video files
      await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
    } catch (error) {
      console.error('Failed to delete from Cloudinary:', error);
      // Don't throw error, just log it
      // File might already be deleted or not exist
    }
  }
}
