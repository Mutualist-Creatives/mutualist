import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBlogDto) {
    try {
      return await this.prisma.blog.create({ data });
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
    return this.prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(slug: string) {
    return this.prisma.blog.findUnique({
      where: { slug },
    });
  }

  async update(slug: string, data: UpdateBlogDto) {
    try {
      return await this.prisma.blog.update({
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
      return await this.prisma.blog.delete({
        where: { slug },
      });
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  }
}
