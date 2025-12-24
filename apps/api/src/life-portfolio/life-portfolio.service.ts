import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateLifePortfolioDto } from './dto/create-life-portfolio.dto';
import { UpdateLifePortfolioDto } from './dto/update-life-portfolio.dto';

@Injectable()
export class LifePortfolioService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async create(createPortfolioDto: CreateLifePortfolioDto) {
    return this.prisma.lifePortfolio.create({
      data: createPortfolioDto,
    });
  }

  async findAll() {
    return this.prisma.lifePortfolio.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const portfolio = await this.prisma.lifePortfolio.findUnique({
      where: { id },
    });

    if (!portfolio) {
      throw new NotFoundException(`Portfolio with ID ${id} not found`);
    }

    return portfolio;
  }

  async update(id: string, updatePortfolioDto: UpdateLifePortfolioDto) {
    const existingPortfolio = await this.findOne(id); // Check if exists

    // If images are being updated, delete old images that are not in the new list
    if (updatePortfolioDto.images) {
      const oldImages = existingPortfolio.images || [];
      const newImages = updatePortfolioDto.images;

      // Find images that are being removed
      const imagesToDelete = oldImages.filter(
        (oldImg: string) => !newImages.includes(oldImg),
      );

      // Delete removed images from storage
      if (imagesToDelete.length > 0) {
        await this.uploadService.deleteMultipleFiles(imagesToDelete);
      }
    }

    return this.prisma.lifePortfolio.update({
      where: { id },
      data: updatePortfolioDto,
    });
  }

  async remove(id: string) {
    const portfolio = await this.findOne(id); // Check if exists

    // Delete images from Supabase storage first (best effort)
    if (portfolio.images && portfolio.images.length > 0) {
      try {
        console.log(
          `Deleting ${portfolio.images.length} images for portfolio ${id}`,
        );
        await this.uploadService.deleteMultipleFiles(portfolio.images);
        console.log('Images deletion attempted');
      } catch (error) {
        // Log error but don't fail the deletion
        console.error('Failed to delete some images from storage:', error);
        console.log('Continuing with portfolio deletion anyway');
      }
    }

    // Delete portfolio from database (this should always succeed)
    try {
      await this.prisma.lifePortfolio.delete({
        where: { id },
      });
      console.log(`Portfolio ${id} deleted successfully`);
      return { success: true, message: 'Portfolio deleted successfully' };
    } catch (error) {
      console.error('Failed to delete portfolio from database:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to delete portfolio: ${errorMessage}`);
    }
  }

  async getCategories() {
    const portfolios = await this.prisma.lifePortfolio.findMany({
      select: { categories: true },
    });

    // Flatten array of arrays and get unique categories
    const allCategories = portfolios.flatMap(
      (p: { categories: string[] }) => p.categories || [],
    );
    const categories = [...new Set(allCategories)];
    return categories;
  }
}
