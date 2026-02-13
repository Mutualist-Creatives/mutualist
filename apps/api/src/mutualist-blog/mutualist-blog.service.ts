import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { Prisma } from '@prisma/client';
import { CreateMutualistBlogDto } from './dto/create-mutualist-blog.dto';
import { UpdateMutualistBlogDto } from './dto/update-mutualist-blog.dto';

@Injectable()
export class MutualistBlogService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async create(data: CreateMutualistBlogDto) {
    try {
      return await this.prisma.mutualistBlog.create({ data });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new HttpException(
            'Blog with this slug already exists',
            HttpStatus.CONFLICT,
          );
        }
      }
      const message = e instanceof Error ? e.message : 'Unknown error';
      console.error('Error creating blog:', e);
      throw new HttpException(
        `Failed to create blog: ${message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return this.prisma.mutualistBlog.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(slug: string) {
    return this.prisma.mutualistBlog.findUnique({
      where: { slug },
    });
  }

  async update(slug: string, data: UpdateMutualistBlogDto) {
    try {
      // Get existing blog to check for image changes
      const existing = await this.findOne(slug);

      if (
        existing &&
        data.image &&
        existing.image &&
        data.image !== existing.image
      ) {
        // Image changed, delete old one
        await this.uploadService.deleteFile(existing.image);
      }

      return await this.prisma.mutualistBlog.update({
        where: { slug },
        data,
      });
    } catch (e) {
      console.error('Error updating blog:', e);
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new HttpException(
            'Blog with this slug already exists',
            HttpStatus.CONFLICT,
          );
        }
      }
      throw e;
    }
  }

  async remove(slug: string) {
    try {
      const blog = await this.findOne(slug);

      if (blog && blog.image) {
        await this.uploadService.deleteFile(blog.image);
      }

      return await this.prisma.mutualistBlog.delete({
        where: { slug },
      });
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  }
}
