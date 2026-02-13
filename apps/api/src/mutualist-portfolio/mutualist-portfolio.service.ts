import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { Prisma } from '@prisma/client';
import { CreateMutualistPortfolioDto } from './dto/create-mutualist-portfolio.dto';
import { UpdateMutualistPortfolioDto } from './dto/update-mutualist-portfolio.dto';

@Injectable()
export class MutualistPortfolioService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async create(data: CreateMutualistPortfolioDto) {
    try {
      return await this.prisma.mutualistPortfolio.create({ data });
    } catch (e) {
      console.error('Error creating portfolio:', e);
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
    return this.prisma.mutualistPortfolio.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(slug: string) {
    return this.prisma.mutualistPortfolio.findUnique({
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

  async update(slug: string, data: UpdateMutualistPortfolioDto) {
    try {
      const existing = await this.prisma.mutualistPortfolio.findUnique({
        where: { slug },
      });

      if (!existing) {
        throw new HttpException('Portfolio not found', HttpStatus.NOT_FOUND);
      }

      // Cleanup removed content images
      if (data.content) {
        const oldImages = this.extractImagesFromContent(
          existing.content as Array<{ type: string; images: string[] }>,
        );
        const newImages = this.extractImagesFromContent(
          data.content as Array<{ type: string; images: string[] }>,
        );

        const imagesToDelete = oldImages.filter(
          (oldImg) => !newImages.includes(oldImg),
        );

        if (imagesToDelete.length > 0) {
          console.log(
            `Cleaning up ${imagesToDelete.length} removed images for portfolio ${slug}`,
          );
          try {
            await this.uploadService.deleteMultipleFiles(imagesToDelete);
          } catch (error) {
            console.error('Failed to delete some images from storage:', error);
          }
        }
      }

      // Cleanup removed service icons
      if (data.serviceIcons) {
        const oldIcons = existing.serviceIcons || [];
        const newIcons = data.serviceIcons;

        const iconsToDelete = oldIcons.filter(
          (icon) => !newIcons.includes(icon),
        );

        if (iconsToDelete.length > 0) {
          console.log(
            `Cleaning up ${iconsToDelete.length} removed service icons for portfolio ${slug}`,
          );
          try {
            await this.uploadService.deleteMultipleFiles(iconsToDelete);
          } catch (error) {
            console.error('Failed to delete some icons:', error);
          }
        }
      }

      return await this.prisma.mutualistPortfolio.update({
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
      const portfolio = await this.prisma.mutualistPortfolio.findUnique({
        where: { slug },
      });

      if (!portfolio) {
        throw new HttpException('Portfolio not found', HttpStatus.NOT_FOUND);
      }

      const contentImages = this.extractImagesFromContent(
        portfolio.content as Array<{ type: string; images: string[] }>,
      );

      const serviceIcons = portfolio.serviceIcons || [];
      const allImagesToDelete = [...contentImages, ...serviceIcons];

      if (allImagesToDelete.length > 0) {
        console.log(
          `Deleting ${allImagesToDelete.length} images/icons for portfolio ${slug}`,
        );
        try {
          await this.uploadService.deleteMultipleFiles(allImagesToDelete);
          console.log('Images deletion attempted');
        } catch (error) {
          console.error('Failed to delete some images from storage:', error);
          console.log('Continuing with portfolio deletion anyway');
        }
      }

      await this.prisma.mutualistPortfolio.delete({
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
