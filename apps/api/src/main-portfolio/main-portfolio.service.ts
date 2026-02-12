import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { Prisma } from '@prisma/client';
import { CreateMainPortfolioDto } from './dto/create-main-portfolio.dto';
import { UpdateMainPortfolioDto } from './dto/update-main-portfolio.dto';

@Injectable()
export class MainPortfolioService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async create(data: CreateMainPortfolioDto) {
    try {
      return await this.prisma.mainPortfolio.create({ data });
    } catch (e) {
      console.error('Error creating portfolio:', e);
      // Check for Prisma unique constraint violation (P2002)
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new HttpException(
            `Portfolio with this slug already exists`,
            HttpStatus.CONFLICT,
          );
        }
      }
      const message = e instanceof Error ? e.message : 'Unknown error';
      throw new HttpException(
        `Failed to create portfolio: ${message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return this.prisma.mainPortfolio.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(slug: string) {
    return this.prisma.mainPortfolio.findUnique({
      where: { slug },
    });
  }

  /**
   * Extract all image URLs from content blocks
   */
  private extractImagesFromContent(
    content: Array<{ type: string; images: string[] }>,
  ): string[] {
    if (!content || !Array.isArray(content)) return [];
    return content.flatMap((block) => block.images || []).filter(Boolean);
  }

  async update(slug: string, data: UpdateMainPortfolioDto) {
    try {
      // Get existing portfolio to compare images
      const existing = await this.prisma.mainPortfolio.findUnique({
        where: { slug },
      });

      if (!existing) {
        throw new HttpException('Portfolio not found', HttpStatus.NOT_FOUND);
      }

      // If content is being updated, clean up removed images
      if (data.content) {
        const oldImages = this.extractImagesFromContent(
          existing.content as Array<{ type: string; images: string[] }>,
        );
        const newImages = this.extractImagesFromContent(
          data.content as Array<{ type: string; images: string[] }>,
        );

        // Find images that are being removed
        const imagesToDelete = oldImages.filter(
          (oldImg) => !newImages.includes(oldImg),
        );

        // Delete removed images from storage (best effort)
        if (imagesToDelete.length > 0) {
          console.log(
            `Cleaning up ${imagesToDelete.length} removed images for portfolio ${slug}`,
          );
          try {
            await this.uploadService.deleteMultipleFiles(imagesToDelete);
          } catch (error) {
            console.error('Failed to delete some images from storage:', error);
            // Continue with update anyway
          }
        }
      }

      return await this.prisma.mainPortfolio.update({
        where: { slug },
        data,
      });
    } catch (error) {
      console.error('Error updating portfolio:', error);
      throw error;
    }
  }

  async remove(slug: string) {
    try {
      // Get portfolio to retrieve images before deletion
      const portfolio = await this.prisma.mainPortfolio.findUnique({
        where: { slug },
      });

      if (!portfolio) {
        throw new HttpException('Portfolio not found', HttpStatus.NOT_FOUND);
      }

      // Extract all images from content blocks
      const imagesToDelete = this.extractImagesFromContent(
        portfolio.content as Array<{ type: string; images: string[] }>,
      );

      // Delete images from storage first (best effort)
      if (imagesToDelete.length > 0) {
        console.log(
          `Deleting ${imagesToDelete.length} images for portfolio ${slug}`,
        );
        try {
          await this.uploadService.deleteMultipleFiles(imagesToDelete);
          console.log('Images deletion attempted');
        } catch (error) {
          console.error('Failed to delete some images from storage:', error);
          console.log('Continuing with portfolio deletion anyway');
        }
      }

      // Delete portfolio from database
      await this.prisma.mainPortfolio.delete({
        where: { slug },
      });

      console.log(`Portfolio ${slug} deleted successfully`);
      return { success: true, message: 'Portfolio deleted successfully' };
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      throw error;
    }
  }
}
